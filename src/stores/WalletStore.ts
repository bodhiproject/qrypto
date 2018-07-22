import { Wallet, Insight } from 'qtumjs-wallet';
import { observable, action, toJS, computed, runInAction } from 'mobx';
import { find, isEmpty } from 'lodash';
import axios from 'axios';

import AppStore from './AppStore';
import { STORAGE, MESSAGE_TYPE } from '../constants';
import Account from '../models/Account';

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
  private getInfoInterval?: number = undefined;
  private getPriceInterval?: number = undefined;

  constructor(app: AppStore) {
    this.app = app;
  }

  @action
  public startPolling = async () => {
    await this.getWalletInfo();
    await this.getQtumPrice();

    this.getInfoInterval = window.setInterval(() => {
      this.getWalletInfo();
    }, WalletStore.GET_INFO_INTERVAL_MS);
    this.getPriceInterval = window.setInterval(() => {
      this.getQtumPrice();
    }, WalletStore.GET_PRICE_INTERVAL_MS);
  }

  @action
  public stopPolling = () => {
    if (this.getInfoInterval) {
      clearInterval(this.getInfoInterval);
      this.getInfoInterval = undefined;
    }
    if (this.getPriceInterval) {
      clearInterval(this.getPriceInterval);
      this.getPriceInterval = undefined;
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

    runInAction(async () => {
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
    });
  }

  /*
  * Finds the account based on the name and logs in.
  * @param accountName {string} The account name to search by.
  */
  @action
  public async loginAccount(accountName: string) {
    this.loading = true;

    runInAction(async () => {
      const accounts = this.app.networkStore.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
      const foundAccount = find(accounts, { name: accountName });

      if (!foundAccount) {
        throw Error('Account should not be undefined');
      }

      this.loggedInAccount = foundAccount;

      // Recover wallet
      const network = this.app.networkStore.network;
      this.wallet = await network.fromEncryptedPrivateKey(
        this.loggedInAccount!.privateKeyHash,
        this.validPasswordHash,
        WalletStore.SCRYPT_PARAMS_PRIV_KEY,
      );

      // Save logged in account info to local storage for QryptoRpcProvider usage
      this.setLoggedInAccountToStorage();

      await this.onAccountLoggedIn();
    });
  }

  @action
  public logout = () => {
    this.stopPolling();
    this.info =  INIT_VALUES.info;
    this.loggedInAccount = INIT_VALUES.loggedInAccount;
    this.wallet = INIT_VALUES.wallet;
    this.removeLoggedInAccountFromStorage();
    this.routeToAccountPage();
  }

  public isWalletNameTaken = (name: string): boolean => {
    const accounts = this.app.networkStore.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    return !!find(accounts, { name });
  }

  public isWalletMnemonicTaken = async (mnemonic: string): Promise<boolean> => {
    const network = this.app.networkStore.network;
    const wallet = await network.fromMnemonic(mnemonic);
    const privateKeyHash = await wallet.toEncryptedPrivateKey(
      this.validPasswordHash,
      WalletStore.SCRYPT_PARAMS_PRIV_KEY,
    );
    const accounts = this.app.networkStore.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    return !!find(accounts, { privateKeyHash });
  }

  /*
  * Routes to the CreateWallet or AccountLogin page after unlocking with the password.
  */
  @action
  private routeToAccountPage = () => {
    const accounts = this.app.networkStore.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    if (isEmpty(accounts)) {
      // Account not found, route to Create Wallet page
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGIN_SUCCESS_NO_ACCOUNTS });
    } else {
      // Accounts found, route to Account Login page
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGIN_SUCCESS_WITH_ACCOUNTS });
    }
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

  private setLoggedInAccountToStorage() {
    return chrome.storage.local.set(
      {
        [STORAGE.LOGGED_IN_ACCOUNT]: {
          isMainNet: this.app.networkStore.isMainNet,
          name: this.loggedInAccount!.name,
          privateKeyHash: this.loggedInAccount!.privateKeyHash,
          passwordHash: this.passwordHash,
        },
      },
      () => console.log('loggedInAccount saved in storage'),
    );
  }

  private removeLoggedInAccountFromStorage() {
    return chrome.storage.local.remove(
      STORAGE.LOGGED_IN_ACCOUNT,
      () => console.log('loggedInAccount removed from storage'),
    );
  }
}
