import { observable, computed, action } from 'mobx';
import { isEmpty } from 'lodash';

import { MESSAGE_TYPE } from '../constants';

const INIT_VALUES = {
  hasAccounts: false,
  password: '',
  confirmPassword: '',
  invalidPassword: undefined,
};

export default class LoginStore {
  @observable public hasAccounts: boolean = INIT_VALUES.hasAccounts;
  @observable public password: string = INIT_VALUES.password;
  @observable public confirmPassword: string = INIT_VALUES.confirmPassword;
  @observable public invalidPassword?: boolean = INIT_VALUES.invalidPassword;
  @computed public get matchError(): string | undefined {
    return this.getMatchError();
  }
  @computed public get error(): boolean {
    const matchError = this.getMatchError();
    return (!this.hasAccounts && !!matchError) || isEmpty(this.password);
  }

  constructor() {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.HAS_ACCOUNTS }, (response: any) => this.hasAccounts = response);
  }

  @action
  public init = () => {
    this.password = INIT_VALUES.password;
    this.confirmPassword = INIT_VALUES.confirmPassword;
  }

  private getMatchError = (): string | undefined => {
    let error;
    if (this.password !== this.confirmPassword) {
      error = 'Passwords do not match.';
    }
    return error;
  }
}
