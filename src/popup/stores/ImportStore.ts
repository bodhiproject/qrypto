import { observable, action, computed, reaction } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';
import { isValidPrivateKey } from '../../utils';
import { MESSAGE_TYPE, IMPORT_TYPE } from '../../constants';

const INIT_VALUES = {
  mnemonicPrivateKey: '',
  accountName: '',
  walletNameTaken: false,
  importMnemonicPrKeyFailed: false,
  importType: IMPORT_TYPE.MNEMONIC,
};

export default class ImportStore {
  // User input field, could be mnemonic or privateKey, depending on importType
  @observable public mnemonicPrivateKey: string = INIT_VALUES.mnemonicPrivateKey;
  @observable public accountName: string = INIT_VALUES.accountName;
  @observable public walletNameTaken: boolean = INIT_VALUES.walletNameTaken;
  @observable public importMnemonicPrKeyFailed: boolean = INIT_VALUES.importMnemonicPrKeyFailed;
  @observable public importType: string = INIT_VALUES.importType;

  @computed public get walletNameError(): string | undefined {
    return this.walletNameTaken ? 'Wallet name is taken' : undefined;
  }
  @computed public get mnemonicPrKeyPageError(): boolean {
      return [this.mnemonicPrivateKey, this.accountName].some(isEmpty) || !!this.walletNameError;
  }
  @computed public get privateKeyError(): string | undefined {
    if (this.importType === IMPORT_TYPE.PRIVATE_KEY) {
      return isValidPrivateKey(this.mnemonicPrivateKey) ? undefined : 'Not a valid private key';
    } else {
      return undefined;
    }
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
  public changeImportType = (type: string) => {
    this.importType = type;
  }

  @action
  public reset = () => {
    const tempImportType = this.importType;
    Object.assign(this, INIT_VALUES);
    this.importType = tempImportType;
  }

  @action
  public importMnemonicOrPrKey = () => {
    if (!this.mnemonicPrKeyPageError) {
      this.app.routerStore.push('/loading');
      const msgType = this.importType === IMPORT_TYPE.MNEMONIC
        ? MESSAGE_TYPE.IMPORT_MNEMONIC : MESSAGE_TYPE.IMPORT_PRIVATE_KEY;
      chrome.runtime.sendMessage({
        type: msgType,
        accountName: this.accountName,
        mnemonicPrivateKey: this.mnemonicPrivateKey,
      });
    }
  }

  @action
  public cancelImport = () => {
    this.app.routerStore.goBack();
  }
}
