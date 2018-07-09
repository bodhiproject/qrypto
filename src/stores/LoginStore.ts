import { observable, action } from 'mobx';

import AppStore from './AppStore';

const INIT_VALUES = {
  selectedWalletName: '',
  password: '',
};

export default class LoginStore {
  @observable public selectedWalletName: string = INIT_VALUES.selectedWalletName;
  @observable public password: string = INIT_VALUES.password;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
  }

  @action
  public init = () => {
    this.selectedWalletName = this.app.walletStore.accounts[0].name;
  }

  @action
  public login = () => {
    this.app.walletStore.login(this.selectedWalletName);
    this.reset();
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}
