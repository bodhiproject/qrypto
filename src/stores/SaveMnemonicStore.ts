import { observable, action } from 'mobx';
import bip39 from 'bip39';

import AppStore from './AppStore';

const INIT_VALUES = {
  mnemonic: '',
  walletName: '',
};

export default class SaveMnemonicStore {
  @observable public mnemonic: string = INIT_VALUES.mnemonic;
  public walletName: string = INIT_VALUES.walletName;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
  }

  @action
  public generateMnemonic = () => {
    this.mnemonic = bip39.generateMnemonic();
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}
