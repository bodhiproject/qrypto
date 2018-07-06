import { observable, action, computed } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';
import Account from '../models/Account';

const INIT_VALUES = {
  mnemonic: '',
  accountName: '',
  password: '',
  confirmPassword: '',
};

export default class ImportStore {
  @observable public mnemonic: string = INIT_VALUES.mnemonic;
  @observable public accountName: string = INIT_VALUES.accountName;
  @observable public password: string = INIT_VALUES.password;
  @observable public confirmPassword: string = INIT_VALUES.confirmPassword;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
  }

  @computed get matchError(): string | undefined {
    return this.getMatchError();
  }

  @computed get error(): boolean {
    const matchError = this.getMatchError();
    return [this.mnemonic, this.accountName, this.password, this.confirmPassword].some(isEmpty) || !!matchError;
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)

  @action
  public onImportNewMnemonic(mnemonic: string, accountName: string) {
    // Create and store Account in local storage
    // TODO: implement BIP38 encryption on the mnemonic here
    const account = new Account(accountName, mnemonic);
    console.log('created acct');
    this.reset();

    this.app.walletStore.addAccount(account);
    this.app.walletStore.recoverWalletAndGetData(account.mnemonic!);
  }

  private getMatchError = (): string | undefined => {
    let error;
    if (!isEmpty(this.password) && !isEmpty(this.confirmPassword) && this.password !== this.confirmPassword) {
      error = 'Passwords do not match.';
    }
    return error;
  }
}
