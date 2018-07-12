import { observable, action, computed } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';

const INIT_VALUES = {
  walletName: '',
  password: '',
  confirmPassword: '',
  showBackButton: false,
};

export default class LoginStore {
  @observable public walletName: string = INIT_VALUES.walletName;
  @observable public password: string = INIT_VALUES.password;
  @observable public confirmPassword: string = INIT_VALUES.confirmPassword;
  @computed public get matchError(): string | undefined {
    return this.getMatchError();
  }
  @computed public get error(): boolean {
    const matchError = this.getMatchError();
    return [this.walletName, this.password, this.confirmPassword].some(isEmpty) || !!matchError;
  }

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

  private getMatchError = (): string | undefined => {
    let error;
    if (!isEmpty(this.password) && !isEmpty(this.confirmPassword) && this.password !== this.confirmPassword) {
      error = 'Passwords do not match.';
    }
    return error;
  }
}
