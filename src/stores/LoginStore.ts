import { observable, action } from 'mobx';

const INIT_VALUES = {
  password: '',
};

export default class LoginStore {
  @observable public password: string = INIT_VALUES.password;

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}
