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
  @computed public get walletNameError(): string | undefined {
    return this.app.walletStore.isWalletNameTaken(this.accountName) ? 'Wallet name is taken' : undefined;
  }
  @computed public get error(): boolean {
    return [this.mnemonic, this.accountName].some(isEmpty) || !!this.walletNameError;
  }

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)

  @action
  public importNewMnemonic = () => {
    this.app.walletStore.addAccountAndLogin(this.accountName, this.mnemonic);
    this.reset();
  }

  @action
  public cancelImport = () => {
    this.reset();
    this.app.routerStore.goBack();
  }
}
