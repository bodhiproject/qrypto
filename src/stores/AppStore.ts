console.log("starting AppStore file")
import { action, observable } from 'mobx';

// import { WalletStore } from './WalletStore';
import walletStore from './WalletStore';
import uiStore from './UiStore';
import accountDetailStore from './AccountDetailStore';
import transactionStore from './TransactionStore';


// export class AppStore {
class AppStore {
  // @observable loading = true
  public location = '/import-mnemonic';
  public ui = {};
  public accountDetailStore = {};
  public walletStore = {};
  public transactionStore = {};

  constructor() {
    console.log("constructor AppStore")
    // var x = this.init()
    // console.log("x", x)
    // console.log("5")
    this.initChildStores()
  }

  public initChildStores(){
    this.ui = uiStore;
    this.accountDetailStore = accountDetailStore;
    this.transactionStore = transactionStore;
    this.walletStore = walletStore;

  }

  // @action 
  // async init() {
    // this.ui = uiStore;
    // this.walletStore = walletStore;
    // this.walletStore = new WalletStore(this);
    // await this.walletStore.init(); // if mnemomic in local storage, wait on this before setting loading to false
    // this.homeStore = homeStore;
    // this.loading = false
    // console.log("inside app store init")
  // }
}

const store = new AppStore();
window.store = store; // allows us to see store in browser console for debugging
export default store;

// export { AppStore };