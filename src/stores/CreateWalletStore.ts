import { observable, action, computed } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';

const INIT_VALUES = {
  walletName: '',
  showBackButton: false,
};

export default class CreateWalletStore {
  @observable public walletName: string = INIT_VALUES.walletName;
  @computed public get walletNameError(): string | undefined {
    return this.app.walletStore.isWalletNameTaken(this.walletName) ? 'Wallet name is taken' : undefined;
  }
  @computed public get error(): boolean {
    return isEmpty(this.walletName) || !!this.walletNameError;
  }
  public showBackButton: boolean = INIT_VALUES.showBackButton;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)

  @action
  public routeToSaveMnemonic = () => {
    this.app.routerStore.push('/save-mnemonic');
  }

  @action
  public routeToImportWallet = () => {
    this.app.routerStore.push('/import');
  }
}
