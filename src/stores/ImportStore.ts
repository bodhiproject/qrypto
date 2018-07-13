import { observable, action, computed } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';

const INIT_VALUES = {
  mnemonic: '',
  accountName: '',
};

export default class ImportStore {
  @observable public mnemonic: string = INIT_VALUES.mnemonic;
  @observable public accountName: string = INIT_VALUES.accountName;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
  }

  @computed get error(): boolean {
    return [this.mnemonic, this.accountName].some(isEmpty);
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)

  @action
  public importNewMnemonic = () => {
    this.app.walletStore.loading = true;
    this.app.walletStore.addAccount(this.accountName, this.mnemonic);
    this.app.walletStore.loginAccount(this.accountName);
    this.reset();
  }

  @action
  public cancelImport = () => {
    this.reset();
    this.app.routerStore.goBack();
  }
}
