import { observable, action, computed, reaction } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';
import { MESSAGE_TYPE } from '../constants';

const INIT_VALUES = {
  mnemonic: '',
  accountName: '',
  walletNameTaken: false,
  invalidMnemonic: false,
};

export default class ImportStore {
  @observable public mnemonic: string = INIT_VALUES.mnemonic;
  @observable public accountName: string = INIT_VALUES.accountName;
  @observable public walletNameTaken: boolean = INIT_VALUES.walletNameTaken;
  @observable public invalidMnemonic: boolean = INIT_VALUES.invalidMnemonic;
  @computed public get walletNameError(): string | undefined {
    return this.walletNameTaken ? 'Wallet name is taken' : undefined;
  }
  @computed public get error(): boolean {
    return [this.mnemonic, this.accountName].some(isEmpty) || !!this.walletNameError;
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
    if (!this.error) {
      this.app.routerStore.push('/loading');
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.IMPORT_MNEMONIC,
        accountName: this.accountName,
        mnemonic: this.mnemonic,
      });
    }
  }

  @action
  public cancelImport = () => this.app.routerStore.goBack()
}
