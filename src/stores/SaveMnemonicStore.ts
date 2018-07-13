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
  public createWallet = () => {
    this.app.walletStore.loading = true;
    this.app.walletStore.addAccount(this.walletName, this.mnemonic);
    this.app.walletStore.loginAccount(this.walletName);
    this.reset();
  }

  @action
  public saveToFile = () => {
    const timestamp = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const file = new Blob([this.mnemonic], {type: 'text/plain'});
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = `qrypto_${this.walletName}_${timestamp}.bak`;
    element.click();

    this.createWallet();
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}
