import { observable, action } from 'mobx';

import walletStore from './WalletStore';
import Account from '../models/Account';

const INIT_VALUES = {
  enteredMnemonic: '',
  accountName: '',
  password: '',
  confirmPassword: '',
};

class ImportStore {
  @observable public enteredMnemonic: string = INIT_VALUES.enteredMnemonic;
  @observable public accountName: string = INIT_VALUES.accountName;
  @observable public password: string = INIT_VALUES.password;
  @observable public confirmPassword: string = INIT_VALUES.confirmPassword;

  @action
  public reset = () => Object.assign(this, INIT_VALUES)

  @action
  public onImportNewMnemonic(mnemonic: string, accountName: string) {
    // Create and store Account in local storage
    // TODO: implement BIP38 encryption on the mnemonic here
    const account = new Account(accountName, mnemonic);
    this.reset();

    walletStore.addAccount(account);
    walletStore.recoverWallet(account.mnemonic!);
  }
}

export default new ImportStore();
