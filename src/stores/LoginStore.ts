import { observable, computed, action } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';

const INIT_VALUES = {
  password: '',
  confirmPassword: '',
};

export default class LoginStore {
  @observable public password: string = INIT_VALUES.password;
  @observable public confirmPassword: string = INIT_VALUES.confirmPassword;
  @computed public get matchError(): string | undefined {
    return this.getMatchError();
  }
  @computed public get error(): boolean {
    const matchError = this.getMatchError();
    return this.app.walletStore.appSalt ? isEmpty(this.password) : [this.password, this.confirmPassword].some(isEmpty) || !!matchError;
  }

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
  }

  @action
  public init = () => {
    this.password = INIT_VALUES.password;
    this.confirmPassword = INIT_VALUES.confirmPassword;
  }

  private getMatchError = (): string | undefined => {
    let error;
    if (!isEmpty(this.password) && !isEmpty(this.confirmPassword) && this.password !== this.confirmPassword) {
      error = 'Passwords do not match.';
    }
    return error;
  }
}
