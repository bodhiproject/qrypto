import { observable, action, computed } from 'mobx';
import { isEmpty } from 'lodash';

const INIT_VALUES = {
  password: '',
  confirmPassword: '',
  rerouteToLogin: true,
};

export default class CreateWalletStore {
  @observable public password: string = INIT_VALUES.password;
  @observable public confirmPassword: string = INIT_VALUES.confirmPassword;
  public rerouteToLogin: boolean = INIT_VALUES.rerouteToLogin;

  @computed get matchError(): string | undefined {
    return this.getMatchError();
  }

  @computed get error(): boolean {
    const matchError = this.getMatchError();
    return [this.password, this.confirmPassword].some(isEmpty) || !!matchError;
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)

  private getMatchError = (): string | undefined => {
    let error;
    if (!isEmpty(this.password) && !isEmpty(this.confirmPassword) && this.password !== this.confirmPassword) {
      error = 'Passwords do not match.';
    }
    return error;
  }
}
