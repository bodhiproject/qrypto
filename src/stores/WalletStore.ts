import { networks, Wallet, Insight } from 'qtumjs-wallet';
import { observable, action, runInAction } from 'mobx';
import _ from 'lodash';

import transactionStore from './TransactionStore';
import { STORAGE } from '../constants';
import Account from '../models/Account';

class WalletStore {
  @observable public info?: Insight.IGetInfo = undefined;
  @observable public accounts: Account[] = [];
  @observable public enteredMnemonic: string = '';
  @observable public password: string = '';
  @observable public confirmPassword: string = '';
  @observable public tip: string = '';

  // Loading screen flow for app first load and import mnemonic
  // 1 Default -> loading true
  // 2 chrome.storage loading mnemonic
  //   if mnemonic does not exist -> loading false
  //     -(redirects to importMnemonic page)
  //     -importMnemonic pressed -> loading true (go to 3)
  //   if mnemonic exists -> loading still true (go to 3)
  // 3 on wallet load/info loaded -> loading false
  @observable public loading = true;

  @observable private mnemonic: string = '';
  @observable private receiverAddress: string = '';
  @observable private amount: string = '0';

  private wallet?: Wallet = undefined;
  private getInfoInterval?: NodeJS.Timer = undefined;

  constructor() {
    console.log('constructor walletStore');
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
      this.mnemonic = this.accounts[0].mnemonic!;
      this.recoverWallet(this.accounts[0].mnemonic);
      this.loading = false;
    });
  }

  @action
  public onCreateNewWallet() {
    // TODO: implement
  }

  @action
  public onImportNewMnemonic() {
    // Create and store Account in local storage
    // TODO: implement BIP38 encryption on the mnemonic here
    const account = new Account('Default Account', this.enteredMnemonic);
    const accounts = [account];
    this.accounts = accounts;
    chrome.storage.local.set({
      [STORAGE.TESTNET_ACCOUNTS]: accounts,
    }, () => console.log('Account saved'));

    // Initialize QtumJS wallet instance and getInfo to avoid delay
    this.recoverWallet(account.mnemonic);

    // Reset values
    this.enteredMnemonic = '';
    this.password = '';
    this.confirmPassword = '';

    // Toggle loading screen
    this.loading = false;
  }

  @action
  public async send() {
    this.tip = 'Sending...';
    try {
      await this.wallet!.send(this.receiverAddress, this.amount * 1e8, {
        feeRate: 4000,
      });
      runInAction(() => {
        this.tip = 'Sent!';
      });
    } catch (err) {
      console.log(err);
      this.tip = err.message;
    }
  }

  @action
  public startGetInfoPolling() {
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
  public onLogout = () => {
    chrome.storage.local.set({
      [STORAGE.TESTNET_ACCOUNTS]: [],
    }, () => console.log('Logged out'));

    this.mnemonic = '';
    this.enteredMnemonic = '';
  }

  @action
  private async getWalletInfo() {
    this.info = await this.wallet!.getInfo();
    transactionStore.loadFromIds(this.info.transactions);
  }

  @action
  private recoverWallet(mnemonic: string = this.mnemonic): Wallet {
    console.log('wallet store recoverWallet, mnemonic:', mnemonic);
    const network = networks.testnet;
    this.wallet = network.fromMnemonic(mnemonic);
    this.getWalletInfo();
  }
}

export default new WalletStore();
