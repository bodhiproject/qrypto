import { observable, action } from 'mobx';
import bip39 from 'bip39';

import Account from '../models/Account';
import AppStore from './AppStore';

const INIT_VALUES = {
  mnemonic: '',
  walletName: '',
  password: '',
};

export default class SaveMnemonicStore {
  @observable public mnemonic: string = INIT_VALUES.mnemonic;
  public walletName: string = INIT_VALUES.walletName;
  public password: string = INIT_VALUES.password;

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
    // TODO: use this.password to encrypt wallet
    console.log(this.password);

    this.app.walletStore.loading = true;

    const account = new Account(this.walletName, this.mnemonic);
    this.reset();

    this.app.walletStore.addAccount(account);
    this.app.walletStore.loginAccount(account.name);
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
