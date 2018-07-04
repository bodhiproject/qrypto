import { observable, action } from 'mobx';

const INIT_VALUES = {
  enteredMnemonic: '',
  password: '',
  confirmPassword: '',
};

class ImportMnemonicStore {
  @observable public enteredMnemonic: string = INIT_VALUES.enteredMnemonic;
  @observable public password: string = INIT_VALUES.password;
  @observable public confirmPassword: string = INIT_VALUES.confirmPassword;

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}

export default new ImportMnemonicStore();
