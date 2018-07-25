import { RouterStore } from 'mobx-react-router';

import NavBarStore from './components/NavBarStore';
import SessionStore from './SessionStore';
import LoginStore from './LoginStore';
import CreateWalletStore from './CreateWalletStore';
import SaveMnemonicStore from './SaveMnemonicStore';
import AccountLoginStore from './AccountLoginStore';
import ImportStore from './ImportStore';
import AccountDetailStore from './AccountDetailStore';
import SendStore from './SendStore';

export default class AppStore {
  public routerStore: RouterStore;
  public sessionStore: SessionStore;
  public navBarStore: NavBarStore;
  public loginStore: LoginStore;
  public createWalletStore: CreateWalletStore;
  public saveMnemonicStore: SaveMnemonicStore;
  public accountLoginStore: AccountLoginStore;
  public importStore: ImportStore;
  public accountDetailStore: AccountDetailStore;
  public sendStore: SendStore;

  constructor() {
    this.routerStore = new RouterStore();
    this.sessionStore = new SessionStore();
    this.navBarStore = new NavBarStore(this);
    this.loginStore = new LoginStore(this);
    this.createWalletStore = new CreateWalletStore(this);
    this.saveMnemonicStore = new SaveMnemonicStore();
    this.accountLoginStore = new AccountLoginStore(this);
    this.importStore = new ImportStore(this);
    this.accountDetailStore = new AccountDetailStore();
    this.sendStore = new SendStore(this);
  }
}

export const store = new AppStore();
Object.assign(window, { store });
