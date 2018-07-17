import { observable, action, computed, runInAction } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';

const INIT_VALUES = {
  mnemonic: '',
  accountName: '',
  invalidMnemonic: false,
};

export default class ImportStore {
  @observable public mnemonic: string = INIT_VALUES.mnemonic;
  @observable public accountName: string = INIT_VALUES.accountName;
  @observable public invalidMnemonic: boolean = INIT_VALUES.invalidMnemonic;
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
  public importNewMnemonic = async () => {
    this.app.walletStore.loading = true;

    // Validate mnemonic if taken or not
    const isTaken = await this.app.walletStore.isWalletMnemonicTaken(this.mnemonic);
    if (isTaken) {
      runInAction(() => {
        // Show error dialog
        this.invalidMnemonic = true;
        this.app.walletStore.loading = false;
      });
      return;
    }

    runInAction(() => {
      this.app.walletStore.addAccountAndLogin(this.accountName, this.mnemonic);
      this.reset();
    });
  }

  @action
  public cancelImport = () => {
    this.reset();
    this.app.routerStore.goBack();
  }
}
