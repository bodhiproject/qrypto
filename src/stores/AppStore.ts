import uiStore from './UiStore';
import walletStore from './WalletStore';
import signupStore from './SignupStore';
import loginStore from './LoginStore';
import importStore from './ImportStore';
import accountDetailStore from './AccountDetailStore';
import sendStore from './SendStore';

class AppStore {
  public location = '/login';
  public ui = {};
  public walletStore = {};
  public signupStore = {};
  public loginStore = {};
  public importStore = {};
  public accountDetailStore = {};
  public sendStore = {};

  constructor() {
    this.ui = uiStore;
    this.walletStore = walletStore;
    this.signupStore = signupStore;
    this.loginStore = loginStore;
    this.importStore = importStore;
    this.accountDetailStore = accountDetailStore;
    this.sendStore = sendStore;
  }
}

const store = new AppStore();
window.store = store; // allows us to see store in browser console for debugging
export default store;
