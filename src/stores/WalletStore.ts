import { Wallet, Insight } from 'qtumjs-wallet';

import { observable, action, toJS, computed, runInAction } from 'mobx';
import { find } from 'lodash';
import axios from 'axios';

import AppStore from './AppStore';
import { STORAGE } from '../constants';
import Account from '../models/Account';

const INIT_VALUES = {
  info: undefined,
  accounts: [],
  loggedInAccount: undefined,
  wallet: undefined,
};

export default class WalletStore {
  private static GET_INFO_INTERVAL_MS: number = 30000;
  private static GET_PRICE_INTERVAL_MS: number = 60000;

  @observable public loading = true;
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
  private getInfoInterval?: number = undefined;
  private getPriceInterval?: number = undefined;

  constructor(app: AppStore) {
    this.app = app;
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

  @action
  public addAccount(account: Account) {
    const accounts = toJS(this.accounts);
    if (!find(accounts, { mnemonic: account.mnemonic })) {
      accounts.push(account);

      let storageAccountKey;
      if (this.app.networkStore.isMainNet) {
        storageAccountKey = STORAGE.MAINNET_ACCOUNTS;
      } else {
        storageAccountKey = STORAGE.TESTNET_ACCOUNTS;
      }

      chrome.storage.local.set({
        [storageAccountKey]: accounts,
      }, () => console.log('Account added', account));
      this.accounts = accounts;
      this.loggedInAccount = account;
    }
  }

  @action
  public async login(accountName: string) {
    const foundAccount = find(this.accounts, { name: accountName });
    if (foundAccount) {
      this.loggedInAccount = foundAccount;
      await this.recoverWallet(this.loggedInAccount!.mnemonic!);
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
  private recoverWallet = async (mnemonic: string) => {
    const network = this.app.networkStore.network;
    this.wallet = await network.fromMnemonic(mnemonic);
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
