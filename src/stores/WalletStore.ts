import { Wallet, Insight } from 'qtumjs-wallet';
import { observable, action, toJS, computed, runInAction } from 'mobx';
import { find, isEmpty, split } from 'lodash';
import axios from 'axios';
import scrypt from 'scryptsy';

import AppStore from './AppStore';
import { STORAGE } from '../constants';
import Account from '../models/Account';
import QryNetwork from '../models/QryNetwork';

const INIT_VALUES = {
  loading: true,
  appSalt: undefined,
  passwordHash: undefined,
  info: undefined,
  accounts: [],
  testnetAccounts: [],
  mainnetAccounts: [],
  loggedInAccount: undefined,
  wallet: undefined,
};

export default class WalletStore {
  private static SCRYPT_PARAMS_PW: any = { N: 131072, r: 8, p: 1 };
  private static SCRYPT_PARAMS_PRIV_KEY: any = { N: 8192, r: 8, p: 1 };
  private static GET_INFO_INTERVAL_MS: number = 30000;
  private static GET_PRICE_INTERVAL_MS: number = 60000;

  @observable public loading = INIT_VALUES.loading;
  @observable public appSalt?: Uint8Array = INIT_VALUES.appSalt;
  @observable public passwordHash?: string = INIT_VALUES.passwordHash;
  @observable public info?: Insight.IGetInfo = INIT_VALUES.info;
  @observable public testnetAccounts: Account[] = INIT_VALUES.testnetAccounts;
  @observable public mainnetAccounts: Account[] = INIT_VALUES.mainnetAccounts;
  @observable public loggedInAccount?: Account = INIT_VALUES.loggedInAccount;
  @observable public qtumPriceUSD = 0;
  @computed public get hasAccounts(): boolean {
    return !isEmpty(this.mainnetAccounts) || !isEmpty(this.testnetAccounts);
  }
  @computed public get accounts(): Account[] {
    return this.app.networkStore.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
  }
  @computed public get balanceUSD(): string {
    if (this.qtumPriceUSD && this.info) {
      return (this.qtumPriceUSD * this.info.balance).toFixed(2);
    } else {
      return 'Loading';
    }
  }
  public wallet?: Wallet = INIT_VALUES.wallet;

  @computed private get validPasswordHash(): string {
    if (!this.passwordHash) {
      throw Error('passwordHash should be defined');
    }
    return this.passwordHash!;
  }
  private app: AppStore;
  private getInfoInterval?: NodeJS.Timer = undefined;
  private getPriceInterval?: NodeJS.Timer = undefined;

  constructor(app: AppStore) {
    this.app = app;
    this.fetchStorageValues();
  }

  /*
  * Creates a new passwordHash or validates the existing one for the main login.
  * @param password {string} The new/existing password for the per-install appSalt.
  */
  @action
  public login = async (password: string) => {
    this.loading = true;

    // TODO: make this async so it doesnt block the UI
    this.generateAndSetPasswordHash(password);

    if (!this.hasAccounts) {
      // New user. No created wallets yet. No need to validate.
      this.routeToAccountPage();
      return;
    }

    const isPwValid = await this.validatePassword();
    if (isPwValid) {
      this.routeToAccountPage();
      return;
    }

    // Invalid password, display error dialog
    this.app.loginStore.invalidPassword = true;
    this.loading = false;
  }

  @action
  public async startPolling() {
    await this.getWalletInfo();
    await this.getQtumPrice();

    this.getInfoInterval = setInterval(() => {
      this.getWalletInfo();
    }, WalletStore.GET_INFO_INTERVAL_MS);
    this.getPriceInterval = setInterval(() => {
        this.getQtumPrice();
    }, WalletStore.GET_PRICE_INTERVAL_MS);
  }

  @action
  public stopPolling() {
    if (this.getInfoInterval) {
      clearInterval(this.getInfoInterval);
    }
    if (this.getPriceInterval) {
      clearInterval(this.getPriceInterval);
    }
  }

  /*
  * Creates an account, stores it, and logs in.
  * @param accountName {string} The account name for the new wallet account.
  * @param mnemonic {string} The mnemonic to derive the wallet from.
  */
  @action
  public async addAccountAndLogin(accountName: string, mnemonic: string) {
    this.loading = true;
    // TODO: check if account exists already. if so, show error message and stop execution here.

    // Get encrypted private key
    const network = this.app.networkStore.network;
    this.wallet = await network.fromMnemonic(mnemonic);
    const privateKeyHash = await this.wallet.toEncryptedPrivateKey(
      this.validPasswordHash,
      WalletStore.SCRYPT_PARAMS_PRIV_KEY,
    );
    const account = new Account(accountName, privateKeyHash);

    // Add account if not existing
    if (this.app.networkStore.isMainNet) {
      this.mainnetAccounts.push(account);
      chrome.storage.local.set({
        [STORAGE.MAINNET_ACCOUNTS]: toJS(this.mainnetAccounts),
      }, () => console.log('Mainnet Account added', account));
    } else {
      this.testnetAccounts.push(account);
      chrome.storage.local.set({
        [STORAGE.TESTNET_ACCOUNTS]: toJS(this.testnetAccounts),
      }, () => console.log('Testnet Account added', account));
    }

    this.loggedInAccount = account;
    await this.onAccountLoggedIn();
  }

  /*
  * Finds the account based on the name and logs in.
  * @param accountName {string} The account name to search by.
  */
  @action
  public async loginAccount(accountName: string) {
    this.loading = true;

    const accounts = this.app.networkStore.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    const foundAccount = find(accounts, { name: accountName });
    if (foundAccount) {
      this.loggedInAccount = foundAccount;

      // Recover wallet
      const network = this.app.networkStore.network;
      this.wallet = await network.fromEncryptedPrivateKey(
        this.loggedInAccount!.privateKeyHash,
        this.validPasswordHash,
        WalletStore.SCRYPT_PARAMS_PRIV_KEY,
      );

      await this.onAccountLoggedIn();
    }
  }

  @action
  public logout = () => {
    this.stopPolling();
    this.info =  INIT_VALUES.info;
    this.loggedInAccount = INIT_VALUES.loggedInAccount;
    this.wallet = INIT_VALUES.wallet;
    this.routeToAccountPage();
  }

  /*
  * Initializes all the values from Chrome storage on startup.
  */
  private fetchStorageValues = () => {
    const { APP_SALT, MAINNET_ACCOUNTS, TESTNET_ACCOUNTS } = STORAGE;
    chrome.storage.local.get([APP_SALT, MAINNET_ACCOUNTS, TESTNET_ACCOUNTS],
      ({ appSalt, mainnetAccounts, testnetAccounts }: any) => {
        if (!isEmpty(appSalt)) {
          const array = split(appSalt, ',').map((str) => parseInt(str, 10));
          this.appSalt =  Uint8Array.from(array);
        }

        if (!isEmpty(mainnetAccounts)) {
          this.mainnetAccounts = toJS(mainnetAccounts);
        }

        if (!isEmpty(testnetAccounts)) {
          this.testnetAccounts = toJS(testnetAccounts);
        }

        // Show the Login page after fetching storage
        this.loading = false;
      });
  }

  /*
  * Generates the appSalt (if needed) and derives the passwordHash.
  * @param password The password to set or validate.
  * @return Is the password valid.
  */
  @action
  private generateAndSetPasswordHash = (password: string) => {
    // Generate appSalt if needed
    if (!this.appSalt) {
      const appSalt: Uint8Array = window.crypto.getRandomValues(new Uint8Array(16)) as Uint8Array;
      this.appSalt = appSalt;
      chrome.storage.local.set(
        { [STORAGE.APP_SALT]: appSalt.toString() },
        () => console.log('appSalt set'),
      );
    }

    if (!this.appSalt) {
      throw Error('appSalt should not be empty');
    }

    // Derive passwordHash
    const saltBuffer = Buffer.from(this.appSalt!);
    const { N, r, p } = WalletStore.SCRYPT_PARAMS_PW;
    const derivedKey = scrypt(password, saltBuffer, N, r, p, 64);
    this.passwordHash = derivedKey.toString('hex');
  }

  /*
  * Validates a password by decrypting a private key hash into a wallet instance.
  * @return Is the password valid.
  */
  private validatePassword = async (): Promise<boolean> => {
    let qryNetwork: QryNetwork;
    let account: Account;
    if (!isEmpty(this.mainnetAccounts)) {
      qryNetwork = this.app.networkStore.networksArray[0];
      account = this.mainnetAccounts[0];
    } else if (!isEmpty(this.testnetAccounts)) {
      qryNetwork = this.app.networkStore.networksArray[1];
      account = this.testnetAccounts[0];
    } else {
      throw Error('Trying to validate password without existing account');
    }

    try {
      await qryNetwork.network.fromEncryptedPrivateKey(
        account.privateKeyHash,
        this.validPasswordHash,
        WalletStore.SCRYPT_PARAMS_PRIV_KEY,
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /*
  * Routes to the CreateWallet or AccountLogin page after unlocking with the password.
  */
  @action
  private routeToAccountPage = () => {
    const accounts = this.app.networkStore.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    if (isEmpty(accounts)) {
      // Account not found, route to Create Wallet page
      this.app.routerStore.push('/create-wallet');
    } else {
      // Accounts found, route to Account Login page
      this.app.routerStore.push('/account-login');
    }
    this.loading = false;
  }

  /*
  * Actions after adding a new account or logging into an existing account.
  */
  @action
  private onAccountLoggedIn = async () => {
    await this.startPolling();
    runInAction(() => {
      this.loading = false;
      this.app.routerStore.push('/home');
    });
  }

  @action
  private async getQtumPrice() {
    try {
      const jsonObj = await axios.get('https://api.coinmarketcap.com/v2/ticker/1684/');
      this.qtumPriceUSD = jsonObj.data.data.quotes.USD.price;
    } catch (err) {
      console.log(err);
    }
  }

  @action
  private async getWalletInfo() {
    this.info = await this.wallet!.getInfo();
  }
}
