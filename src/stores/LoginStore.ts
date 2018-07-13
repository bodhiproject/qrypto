import { observable, action, reaction } from 'mobx';
import { isEmpty } from 'lodash';

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

    // Set the default selected account on the login page.
    reaction(
      () => this.app.walletStore.accounts,
      () => {
        if (!isEmpty(this.app.walletStore.accounts)) {
          this.selectedWalletName = this.app.walletStore.accounts[0].name;
        }
      },
    );
  }

  @action
  public login = () => {
    this.app.walletStore.loading = true;

    this.app.walletStore.login(this.selectedWalletName);
    this.reset();
  }

  @action
  public routeToCreateWallet = () => {
    this.app.createWalletStore.showBackButton = true;
    this.app.routerStore.push('/create-wallet');
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}
