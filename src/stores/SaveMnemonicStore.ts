import { observable, action } from 'mobx';
import bip39 from 'bip39';

const INIT_VALUES = {
  mnemonic: '',
};

export default class SaveMnemonicStore {
  @observable public mnemonic: string = INIT_VALUES.mnemonic;

  @action
  public generateSeedPhrase = () => {
    this.mnemonic = bip39.generateMnemonic();
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}
