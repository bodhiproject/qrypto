import { networks, Wallet, Insight } from 'qtumjs-wallet';
import { observable, action, toJS } from 'mobx';
import _ from 'lodash';

import walletStore from './WalletStore';
import accountDetailStore from './AccountDetailStore';
import { STORAGE } from '../constants';
import Account from '../models/Account';

class WalletStore {
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

  private wallet?: Wallet = undefined;
  private getInfoInterval?: NodeJS.Timer = undefined;

  constructor() {
    setTimeout(this.init.bind(this), 100);
  }

  public init() {
    chrome.storage.local.get(STORAGE.TESTNET_ACCOUNTS, async ({ testnetAccounts }) => {
      // Account not found, show Signup page
      if (_.isEmpty(testnetAccounts)) {
        this.loading = false;
        return;
      }

      // Account found, recover wallet
      this.accounts = testnetAccounts;
      this.loggedInAccount = this.accounts[0];
      this.recoverWallet(this.accounts[0].mnemonic!);
      this.loading = false;
    });
  }

  @action
  public addAccount(account: Account) {
    const accounts = toJS(this.accounts);
    if (!_.find(accounts, { mnemonic: account.mnemonic })) {
      accounts.push(account);

      chrome.storage.local.set({
        [STORAGE.TESTNET_ACCOUNTS]: accounts,
      }, () => console.log('Account added', account));
      this.accounts = accounts;
      this.loggedInAccount = account;
    }
  }

  @action
  public onCreateNewWallet() {
    // TODO: implement
  }

  @action
  public recoverWallet(mnemonic: string): Wallet {
    const network = networks.testnet;
    this.wallet = network.fromMnemonic(mnemonic);
    this.loading = false;
  }

  @action
  public startGetInfoPolling() {
    this.getWalletInfo();

    this.getInfoInterval = setInterval(() => {
      this.getWalletInfo();
    }, 5000);
  }

  @action
  public stopGetInfoPolling() {
    if (this.getInfoInterval) {
      clearInterval(this.getInfoInterval);
    }
  }

  @action
  public logout = () => {
    walletStore.stopGetInfoPolling();
  }

  @action
  private async getWalletInfo() {
    this.info = await this.wallet!.getInfo();
    accountDetailStore.loadFromIds(this.info.transactions);
  }
}

export default new WalletStore();
