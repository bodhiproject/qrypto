import { networks, Wallet, Insight } from 'qtumjs-wallet';

import { observable, action, toJS, computed, runInAction } from 'mobx';
import { isEmpty, find } from 'lodash';
import axios from 'axios';

import AppStore from './AppStore';
import { STORAGE } from '../constants';
import Account from '../models/Account';

export default class WalletStore {
  // Loading screen flow for app first load and import mnemonic
  // 1 Default -> loading true
  // 2 chrome.storage loading mnemonic
  //   if mnemonic does not exist -> loading false
  //     -(redirects to importMnemonic page)
  //     -importMnemonic pressed -> loading true (go to 3)
  //   if mnemonic exists -> loading still true (go to 3)
  // 3 on wallet load/info loaded -> loading false
  @observable public loading = true;
  @observable public info?: Insight.IGetInfo = undefined;
  @observable public accounts: Account[] = [];
  @observable public loggedInAccount?: Account = undefined;
  @observable public qtumPriceUSD = 0;
  @computed get balanceUSD() {
    if (this.qtumPriceUSD && this.info) {
      return (this.qtumPriceUSD * this.info.balance).toFixed(2);
    } else {
      return 'Loading';
    }
  }

  public wallet?: Wallet = undefined;

  private app: AppStore;
  private getInfoInterval?: NodeJS.Timer = undefined;
  private getPriceInterval?: NodeJS.Timer = undefined;

  constructor(app: AppStore) {
    this.app = app;

    console.log('walletStore constructor');
    // Set the existing accounts from Chrome storage
    chrome.storage.local.get(STORAGE.TESTNET_ACCOUNTS, ({ testnetAccounts }) => {
      console.log(testnetAccounts);

      // Account not found, route to Create Wallet page
      if (isEmpty(testnetAccounts)) {
        this.loading = false;
        this.app.routerStore.push('/create-wallet');
        return;
      }

      // Accounts found, route to Login page
      this.accounts = testnetAccounts;
      this.app.routerStore.push('/login');
      this.loading = false;
    });
  }

  @action
  public async startPolling() {
    await this.getWalletInfo();
    await this.getQtumPrice();

    this.getInfoInterval = setInterval(() => {
      this.getWalletInfo();
    }, 5000);
    this.getPriceInterval = setInterval(() => {
        this.getQtumPrice();
    }, 60000);
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

      chrome.storage.local.set({
        [STORAGE.TESTNET_ACCOUNTS]: accounts,
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
    this.app.walletStore.stopPolling();
  }

  @action
  private recoverWallet(mnemonic: string) {
    const network = networks.testnet;
    this.wallet = network.fromMnemonic(mnemonic);
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
    this.app.accountDetailStore.loadFromIds(this.info.transactions);
  }
}
