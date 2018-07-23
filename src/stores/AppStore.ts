import { RouterStore } from 'mobx-react-router';

import UiStore from './UiStore';
import LoginStore from './LoginStore';
import CreateWalletStore from './CreateWalletStore';
import SaveMnemonicStore from './SaveMnemonicStore';
import AccountLoginStore from './AccountLoginStore';
import ImportStore from './ImportStore';
import AccountDetailStore from './AccountDetailStore';
import SendStore from './SendStore';

export default class AppStore {
  public location = '/account-login';
  public routerStore: RouterStore;
  public ui: UiStore;
  public loginStore: LoginStore;
  public createWalletStore: CreateWalletStore;
  public saveMnemonicStore: SaveMnemonicStore;
  public accountLoginStore: AccountLoginStore;
  public importStore: ImportStore;
  public accountDetailStore: AccountDetailStore;
  public sendStore: SendStore;

  constructor() {
    this.routerStore = new RouterStore();
    this.ui = new UiStore();
    this.loginStore = new LoginStore(this);
    this.createWalletStore = new CreateWalletStore(this);
    this.saveMnemonicStore = new SaveMnemonicStore(this);
    this.accountLoginStore = new AccountLoginStore(this);
    this.importStore = new ImportStore(this);
    this.accountDetailStore = new AccountDetailStore(this);
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
