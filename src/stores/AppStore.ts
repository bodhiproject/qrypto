import walletStore from './WalletStore';
import uiStore from './UiStore';
import loginStore from './LoginStore';
import importMnemonicStore from './ImportMnemonicStore';
import accountDetailStore from './AccountDetailStore';
import transactionStore from './TransactionStore';

class AppStore {
  public location = '/login';
  public ui = {};
  public loginStore = {};
  public importMnemonicStore = {};
  public accountDetailStore = {};
  public transactionStore = {};
  public walletStore = {};

  constructor() {
    this.ui = uiStore;
    this.loginStore = loginStore;
    this.importMnemonicStore = importMnemonicStore;
    this.accountDetailStore = accountDetailStore;
    this.transactionStore = transactionStore;
    this.walletStore = walletStore;
  }
}

const store = new AppStore();
window.store = store; // allows us to see store in browser console for debugging
export default store;
