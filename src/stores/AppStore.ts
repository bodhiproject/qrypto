import { RouterStore } from 'mobx-react-router';

import NavBarStore from './components/NavBarStore';
import AccountInfoStore from './components/AccountInfoStore';
import LoginStore from './LoginStore';
import CreateWalletStore from './CreateWalletStore';
import SaveMnemonicStore from './SaveMnemonicStore';
import AccountLoginStore from './AccountLoginStore';
import ImportStore from './ImportStore';
import HomeStore from './HomeStore';
import AccountDetailStore from './AccountDetailStore';
import SendStore from './SendStore';

export default class AppStore {
  public location = '/account-login';
  public routerStore: RouterStore;
  public navBarStore: NavBarStore;
  public accountInfoStore: AccountInfoStore;
  public loginStore: LoginStore;
  public createWalletStore: CreateWalletStore;
  public saveMnemonicStore: SaveMnemonicStore;
  public accountLoginStore: AccountLoginStore;
  public importStore: ImportStore;
  public homeStore: HomeStore;
  public accountDetailStore: AccountDetailStore;
  public sendStore: SendStore;

  constructor() {
    this.routerStore = new RouterStore();
    this.navBarStore = new NavBarStore(this);
    this.accountInfoStore = new AccountInfoStore();
    this.loginStore = new LoginStore(this);
    this.createWalletStore = new CreateWalletStore(this);
    this.saveMnemonicStore = new SaveMnemonicStore();
    this.accountLoginStore = new AccountLoginStore(this);
    this.importStore = new ImportStore(this);
    this.homeStore = new HomeStore();
    this.accountDetailStore = new AccountDetailStore();
    this.sendStore = new SendStore(this);
  }
}

export const store = new AppStore();

// allows us to see store in browser console for debugging
declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    store: AppStore;
  }
}
window.store = store;
