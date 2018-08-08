import { observable, action, computed, reaction } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore, { store } from './AppStore';
import { isValidPrivateKey } from '../../utils';
import { MESSAGE_TYPE } from '../../constants';

const INIT_VALUES = {
  mnemonic: '',
  privateKey: '',
  accountName: '',
  walletNameTaken: false,
  importMnemonicFailed: false,
  importPrivateKeyFailed: false,
};

export default class ImportStore {
  @observable public mnemonic: string = INIT_VALUES.mnemonic;
  @observable public privateKey: string = INIT_VALUES.privateKey;
  @observable public accountName: string = INIT_VALUES.accountName;
  @observable public walletNameTaken: boolean = INIT_VALUES.walletNameTaken;
  @observable public importMnemonicFailed: boolean = INIT_VALUES.importMnemonicFailed;
  @observable public importPrivateKeyFailed: boolean = INIT_VALUES.importPrivateKeyFailed;
  @computed public get walletNameError(): string | undefined {
    return this.walletNameTaken ? 'Wallet name is taken' : undefined;
  }
  @computed public get mnemonicPageError(): boolean {
    return [this.mnemonic, this.accountName].some(isEmpty) || !!this.walletNameError;
  }
  @computed public get privateKeyPageError(): boolean {
    return [this.privateKey, this.accountName].some(isEmpty) || !!this.walletNameError;
  }
  @computed public get privateKeyError(): string | undefined {
    return isValidPrivateKey(store.sessionStore.isMainNet, this.privateKey) ? undefined : 'Not a valid private key';
  }

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;

    reaction(
      () => this.accountName,
      () => chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.VALIDATE_WALLET_NAME,
        name: this.accountName,
      }, (response: any) => this.walletNameTaken = response),
    );
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)

  @action
  public importMnemonic = () => {
    if (!this.mnemonicPageError) {
      this.app.routerStore.push('/loading');
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.IMPORT_MNEMONIC,
        accountName: this.accountName,
        mnemonic: this.mnemonic,
      });
    }
  }

  public importPrivateKey = () => {
    if (!this.privateKeyPageError) {
      this.app.routerStore.push('/loading');
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.IMPORT_PRIVATE_KEY,
        accountName: this.accountName,
        privateKey: this.privateKey,
      });
    }
  }

  @action
  public cancelImport = () => this.app.routerStore.goBack()
}
