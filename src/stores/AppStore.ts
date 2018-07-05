import walletStore from './WalletStore';
import uiStore from './UiStore';
import signupStore from './SignupStore';
import loginStore from './LoginStore';
import accountDetailStore from './AccountDetailStore';

class AppStore {
  public location = '/login';
  public ui = {};
  public signupStore = {};
  public loginStore = {};
  public accountDetailStore = {};
  public walletStore = {};

  constructor() {
    this.ui = uiStore;
    this.signupStore = signupStore;
    this.loginStore = loginStore;
    this.accountDetailStore = accountDetailStore;
    this.walletStore = walletStore;
  }
}

const store = new AppStore();
window.store = store; // allows us to see store in browser console for debugging
export default store;
