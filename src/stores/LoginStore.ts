import { observable, computed } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';
import { STORAGE } from '../constants';

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

    /*
    * Check for existing appSalt in Chrome storage, else create one.
    * The appSalt should be per install and not per session.
    */
    chrome.storage.local.get(STORAGE.APP_SALT, ({ appSalt }: any) => {
      this.app.loginStore.hasAppSalt = !isEmpty(appSalt);
      this.app.walletStore.loading = false;
    });
  }

  private getMatchError = (): string | undefined => {
    let error;
    if (!isEmpty(this.password) && !isEmpty(this.confirmPassword) && this.password !== this.confirmPassword) {
      error = 'Passwords do not match.';
    }
    return error;
  }
}
