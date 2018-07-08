import { observable, action } from 'mobx';
import bip39 from 'bip39';

const INIT_VALUES = {
  mnemonic: '',
  password: '',
};

export default class SaveMnemonicStore {
  @observable public mnemonic: string = INIT_VALUES.mnemonic;

  private password: string = INIT_VALUES.password;

  @action
  public generateMnemonic = () => {
    this.mnemonic = bip39.generateMnemonic();
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}
