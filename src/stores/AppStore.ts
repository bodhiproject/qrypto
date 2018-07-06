import UiStore from './UiStore';
import WalletStore from './WalletStore';
import SignupStore from './SignupStore';
import LoginStore from './LoginStore';
import ImportStore from './ImportStore';
import AccountDetailStore from './AccountDetailStore';
import SendStore from './SendStore';

export default class AppStore {
  public location = '/login';
  public ui: UiStore;
  public walletStore: WalletStore;
  public signupStore: SignupStore;
  public loginStore: LoginStore;
  public importStore: ImportStore;
  public accountDetailStore: AccountDetailStore;
  public sendStore: SendStore;

  constructor() {
    this.ui = new UiStore();
    this.walletStore = new WalletStore(this);
    this.signupStore = new SignupStore();
    this.loginStore = new LoginStore();
    this.importStore = new ImportStore(this);
    this.accountDetailStore = new AccountDetailStore();
    this.sendStore = new SendStore(this);
  }
}

export const store = new AppStore();
window.store = store; // allows us to see store in browser console for debugging
