import { Wallet, Insight } from 'qtumjs-wallet';
import { observable, action, toJS, computed, runInAction } from 'mobx';
import { find, isEmpty, split } from 'lodash';
import axios from 'axios';
import scrypt from 'scryptsy';

import AppStore from './AppStore';
import { STORAGE } from '../constants';
import Account from '../models/Account';

const INIT_VALUES = {
  appSalt: undefined,
  passwordHash: undefined,
  info: undefined,
  accounts: [],
  loggedInAccount: undefined,
  wallet: undefined,
};

export default class WalletStore {
  private static GET_INFO_INTERVAL_MS: number = 30000;
  private static GET_PRICE_INTERVAL_MS: number = 60000;

  @observable public loading = true;
  @observable public appSalt?: Uint8Array = INIT_VALUES.appSalt;
  @observable public passwordHash?: string = INIT_VALUES.passwordHash;
  @observable public info?: Insight.IGetInfo = INIT_VALUES.info;
  @observable public accounts: Account[] = INIT_VALUES.accounts;
  @observable public loggedInAccount?: Account = INIT_VALUES.loggedInAccount;
  @observable public qtumPriceUSD = 0;
  @computed public get balanceUSD(): string {
    if (this.qtumPriceUSD && this.info) {
      return (this.qtumPriceUSD * this.info.balance).toFixed(2);
    } else {
      return 'Loading';
    }
  }
  public wallet?: Wallet = INIT_VALUES.wallet;

  private app: AppStore;
  private getInfoInterval?: NodeJS.Timer = undefined;
  private getPriceInterval?: NodeJS.Timer = undefined;

  constructor(app: AppStore) {
    this.app = app;
    this.fetchStorageValues(); // TODO: check logic
    this.getAccountsFromStorage();
  }

  public getAccountsFromStorage() {
    if (this.app.networkStore.isMainNet) {
      // Set the existing accounts from Chrome storage
      chrome.storage.local.get(STORAGE.MAINNET_ACCOUNTS, ({ mainnetAccounts }) => {
        this.setAccountsAndRoute(mainnetAccounts);
      });
    } else {
      // Set the existing accounts from Chrome storage
      chrome.storage.local.get(STORAGE.TESTNET_ACCOUNTS, ({ testnetAccounts }) => {
        this.setAccountsAndRoute(testnetAccounts);
      });
    }
  }

  @action
  public login = async (password: string) => {
    this.loading = true;

    // TODO: make this async so it doesnt block the UI
    // Generate appSalt if needed
    if (!this.appSalt) {
      const appSalt: Uint8Array = window.crypto.getRandomValues(new Uint8Array(16)) as Uint8Array;
      this.appSalt = appSalt;
      chrome.storage.local.set(
        { [STORAGE.APP_SALT]: appSalt.toString() },
        () => console.log('appSalt set'),
      );
    }

    // Derive passwordHash
    const saltBuffer = Buffer.from(this.appSalt!);
    const derivedKey = scrypt(password, saltBuffer, 131072, 8, 1, 64);
    const passwordHash = derivedKey.toString('hex');

    if (!this.passwordHash) {
      // New user, set passwordHash in storage
      this.passwordHash = passwordHash;
      chrome.storage.local.set(
        { [STORAGE.PASSWORD_HASH]: passwordHash },
        () => console.log('passwordHash set'),
      );
      this.fetchAccounts();
    } else {
      if (passwordHash === this.passwordHash) {
        // Existing user, password matches
        this.fetchAccounts();
      } else {
        // Existing user, password does not match
        this.app.loginStore.invalidPassword = true;
        this.loading = false;
      }
    }
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

    const network = networks.testnet;
    this.wallet = network.fromMnemonic(mnemonic);
    console.time('toEncryptedPrivateKey');
    const privateKeyHash = this.wallet.toEncryptedPrivateKey(this.passwordHash!); // TODO: await when changed to async func
    console.timeEnd('toEncryptedPrivateKey');
    const account = new Account(accountName, privateKeyHash);

    // Add account if not existing
    const accounts = toJS(this.accounts);
    if (!find(accounts, { privateKeyHash: account.privateKeyHash })) {
      accounts.push(account);

      // Save account in storage and memory
      const storageAccountKey = this.app.networkStore.isMainNet ? STORAGE.MAINNET_ACCOUNTS : STORAGE.TESTNET_ACCOUNTS;
      chrome.storage.local.set({
        [storageAccountKey]: accounts,
      }, () => console.log('Account added', account));
      this.accounts = accounts;
      this.loggedInAccount = account;

      // Start data polling and route to home
      await this.startPolling();
      runInAction(() => {
        this.loading = false;
        this.app.routerStore.push('/home');
      });
    }
  }

  /*
  * Finds the account based on the name and logs in.
  * @param accountName {string} The account name to search by.
  */
  @action
  public async loginAccount(accountName: string) {
    this.app.walletStore.loading = true;

    const foundAccount = find(this.accounts, { name: accountName });
    if (foundAccount) {
      this.loggedInAccount = foundAccount;
      await this.recoverWallet();
      await this.startPolling();
      runInAction(() => {
        this.loading = false;
        this.app.routerStore.push('/home');
      });
    }
  }

  @action
  public logout = (isSwitchingNetwork: boolean) => {
    this.stopPolling();
    this.info =  INIT_VALUES.info;
    this.loggedInAccount = INIT_VALUES.loggedInAccount;
    this.wallet = INIT_VALUES.wallet;

    if (isSwitchingNetwork) {
      this.accounts = INIT_VALUES.accounts;
      this.app.walletStore.getAccountsFromStorage();
      // we dont call this.app.routerStore.push('/login') here because it is called at the end of getAccountsFromStorage() instead
    } else {
      this.app.routerStore.push('/account-login');
    }
  }

  @action
  private recoverWallet = async () => {
    const network = this.app.networkStore.network;
    this.wallet = await network.fromEncryptedPrivateKey(this.loggedInAccount!.privateKeyHash, this.passwordHash);
  }

  @action
  private setAccountsAndRoute = (storageAccounts: Account[]) => {
    // Account not found, route to Create Wallet page
    if (isEmpty(storageAccounts)) {
      this.app.routerStore.push('/create-wallet');
      this.loading = false;
      return;
    }
    // Accounts found, route to Login page
    this.accounts = storageAccounts;
    this.app.routerStore.push('/account-login');
    this.loading = false;
  }

  private fetchStorageValues = () => {
    const { APP_SALT, PASSWORD_HASH } = STORAGE;
    chrome.storage.local.get([APP_SALT, PASSWORD_HASH], ({ appSalt, passwordHash }: any) => {
      if (!isEmpty(appSalt)) {
        const array = split(appSalt, ',').map((str) => parseInt(str, 10));
        this.appSalt =  Uint8Array.from(array);
      }

      if (!isEmpty(passwordHash)) {
        this.passwordHash = passwordHash;
      }

      this.loading = false;
    });
  }

  // Set the existing accounts from Chrome storage and route
  @action
  private fetchAccounts = () => {
    chrome.storage.local.get(STORAGE.TESTNET_ACCOUNTS, ({ testnetAccounts }) => {
      // Account not found, route to Create Wallet page
      if (isEmpty(testnetAccounts)) {
        this.app.routerStore.push('/create-wallet');
      } else {
        // Accounts found, route to Account Login page
        this.accounts = testnetAccounts;
        this.app.routerStore.push('/account-login');
      }
      this.loading = false;
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
