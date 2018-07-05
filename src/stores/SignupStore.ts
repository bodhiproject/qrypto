import { observable, action } from 'mobx';

const INIT_VALUES = {
  password: '',
  confirmPassword: '',
};

class SignupStore {
  @observable public password: string = INIT_VALUES.password;
  @observable public confirmPassword: string = INIT_VALUES.confirmPassword;

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}

export default new SignupStore();
