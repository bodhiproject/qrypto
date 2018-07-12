import { RouterStore } from 'mobx-react-router';

import UiStore from './UiStore';
import WalletStore from './WalletStore';
import CreateWalletStore from './CreateWalletStore';
import SaveMnemonicStore from './SaveMnemonicStore';
import LoginStore from './LoginStore';
import ImportStore from './ImportStore';
import AccountDetailStore from './AccountDetailStore';
import SendStore from './SendStore';

export default class AppStore {
  public location = '/login';
  public routerStore: RouterStore;
  public ui: UiStore;
  public walletStore: WalletStore;
  public createWalletStore: CreateWalletStore;
  public saveMnemonicStore: SaveMnemonicStore;
  public loginStore: LoginStore;
  public importStore: ImportStore;
  public accountDetailStore: AccountDetailStore;
  public sendStore: SendStore;

  constructor() {
    this.routerStore = new RouterStore();
    this.ui = new UiStore();
    this.walletStore = new WalletStore(this);
    this.createWalletStore = new CreateWalletStore(this);
    this.saveMnemonicStore = new SaveMnemonicStore(this);
    this.loginStore = new LoginStore(this);
    this.importStore = new ImportStore(this);
    this.accountDetailStore = new AccountDetailStore(this);
    this.sendStore = new SendStore(this);
  }
}

export const store = new AppStore();
window.store = store; // allows us to see store in browser console for debugging
