import { Wallet, Insight } from 'qtumjs-wallet';

import { observable, action, toJS, computed, runInAction } from 'mobx';
import { isEmpty, find } from 'lodash';
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

  @computed public get balanceUSD() {
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
    this.getChromeStorage();
  }

  public getChromeStorage() {
    if (this.app.networkStore.isMainNet) {
      // Set the existing accounts from Chrome storage
      chrome.storage.local.get(STORAGE.MAINNET_ACCOUNTS, ({ mainnetAccounts }) => {
        this.handleGetChromeStorageReturn(mainnetAccounts);
      });
    } else {
      // Set the existing accounts from Chrome storage
      chrome.storage.local.get(STORAGE.TESTNET_ACCOUNTS, ({ testnetAccounts }) => {
        this.handleGetChromeStorageReturn(testnetAccounts);
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
      this.recoverWallet(this.loggedInAccount!.mnemonic!);
      await this.startPolling();

      runInAction(() => {
        this.loading = false;
        this.app.routerStore.push('/home');
      });
    }
  }

  @action
  public logout = () => {
    this.reset();
    this.app.routerStore.push('/login');
  }

  @action
  public reset = () => {
    this.stopPolling();
    this.info =  INIT_VALUES.info;
    this.loggedInAccount = INIT_VALUES.loggedInAccount;
    this.wallet = INIT_VALUES.wallet;
  }

  @action
  public resetWithNetwork = () => {
    this.reset();
    this.accounts = INIT_VALUES.accounts;
  }

  @action
  private recoverWallet(mnemonic: string) {
    const network = this.app.networkStore.network;
    this.wallet = network.fromMnemonic(mnemonic);
  }

  private handleGetChromeStorageReturn(storageAccounts: any[]) {
    // Account not found, route to Create Wallet page
    if (isEmpty(storageAccounts)) {
      this.app.routerStore.push('/create-wallet');
      this.loading = false;
      return;
    }
    // Accounts found, route to Login page
    this.accounts = storageAccounts;
     // This is used to set the default selected account on the login page, we also call it indirectly in Login/index.tsx componentDidMount so that the default account is set when a user logs out (without switching networks), which will not hit this chrome storage flow
    this.app.loginStore.selectedWalletName = this.accounts[0].name;
    this.app.routerStore.push('/login');
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
