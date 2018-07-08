import { observable, action } from 'mobx';

const INIT_VALUES = {
  selectedWalletName: '',
  password: '',
};

export default class LoginStore {
  @observable public selectedWalletName: string = INIT_VALUES.selectedWalletName;
  @observable public password: string = INIT_VALUES.password;

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}
