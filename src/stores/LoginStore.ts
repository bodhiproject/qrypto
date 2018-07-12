import { observable, computed, action } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';

const INIT_VALUES = {
  hasAppSalt: false,
  password: '',
  confirmPassword: '',
};

export default class LoginStore {
  @observable public hasAppSalt: boolean = INIT_VALUES.hasAppSalt;
  @observable public password: string = INIT_VALUES.password;
  @observable public confirmPassword: string = INIT_VALUES.confirmPassword;
  @computed public get matchError(): string | undefined {
    return this.getMatchError();
  }
  @computed public get error(): boolean {
    const matchError = this.getMatchError();
    return this.hasAppSalt ? isEmpty(this.password) : [this.password, this.confirmPassword].some(isEmpty) || !!matchError;
  }

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
    this.app.walletStore.fetchAppSalt();
  }

  @action
  public init = () => {
    this.password = INIT_VALUES.password;
    this.confirmPassword = INIT_VALUES.confirmPassword;
  }

  @action
  public login = () => {
    if (!this.hasAppSalt) {
      const appSalt: Uint8Array = window.crypto.getRandomValues(new Uint8Array(16)) as Uint8Array;
      this.app.walletStore.storeAppSalt(appSalt);
    }
  }

  private getMatchError = (): string | undefined => {
    let error;
    if (!isEmpty(this.password) && !isEmpty(this.confirmPassword) && this.password !== this.confirmPassword) {
      error = 'Passwords do not match.';
    }
    return error;
  }
}
