import { observable, computed, action } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';
import { MESSAGE_TYPE, RESPONSE_TYPE } from '../../constants';

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

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.HAS_ACCOUNTS }, (response: any) => this.hasAccounts = response);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.RESTORE_SESSION }, (response: any) => {
      if (response === RESPONSE_TYPE.RESTORING_SESSION) {
        this.app.routerStore.push('/loading');
      }
    });
  }

  @action
  public init = () => {
    this.password = INIT_VALUES.password;
    this.confirmPassword = INIT_VALUES.confirmPassword;
  }

  public login = () => {
    if (this.error === false) {
      this.app.routerStore.push('/loading');
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGIN, password: this.password });
    }
  }

  private getMatchError = (): string | undefined => {
    let error;
    if (this.password !== this.confirmPassword) {
      error = 'Passwords do not match.';
    }
    return error;
  }
}
