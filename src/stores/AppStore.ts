
import walletStore from './WalletStore';
import uiStore from './UiStore';
import transactionStore from './TransactionStore';

class AppStore {
  public location = '/import-mnemonic';
  public ui = {};
  public walletStore = {};
  public transactionStore = {};

  constructor() {
    this.ui = uiStore;
    this.transactionStore = transactionStore;
    this.walletStore = walletStore;
  }
}

const store = new AppStore();
window.store = store; // allows us to see store in browser console for debugging
export default store;
