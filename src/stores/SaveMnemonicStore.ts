import { observable, action } from 'mobx';
import bip39 from 'bip39';

import Account from '../models/Account';

const INIT_VALUES = {
  mnemonic: '',
  walletName: '',
  password: '',
};

export default class SaveMnemonicStore {
  @observable public mnemonic: string = INIT_VALUES.mnemonic;

  private app: AppStore;
  private walletName: string = INIT_VALUES.walletName;
  private password: string = INIT_VALUES.password;

  constructor(app: AppStore) {
    this.app = app;
  }

  @action
  public generateMnemonic = () => {
    this.mnemonic = bip39.generateMnemonic();
  }

  @action
  public createWallet = () => {
    // TODO: use this.password to encrypt wallet
    console.log(this.password);

    const account = new Account(this.walletName, this.mnemonic);
    this.reset();

    const { walletStore } = this.app;
    walletStore.addAccount(account);
    walletStore.recoverWallet(account.mnemonic!);
  }

  public saveToFile = () => {
    const file = new Blob([this.mnemonic], {type: 'text/plain'});
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = `${this.walletName}_backup.txt`;
    element.click();
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}
