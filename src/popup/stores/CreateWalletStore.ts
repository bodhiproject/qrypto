import { observable, action, computed, reaction } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';
import { MESSAGE_TYPE } from '../../constants';

const INIT_VALUES = {
  walletName: '',
  walletNameTaken: false,
  showBackButton: false,
};

export default class CreateWalletStore {
  @observable public walletName: string = INIT_VALUES.walletName;
  @observable public walletNameTaken: boolean = INIT_VALUES.walletNameTaken;
  @computed public get walletNameError(): string | undefined {
    return this.walletNameTaken ? 'Wallet name is taken' : undefined;
  }
  @computed public get error(): boolean {
    return isEmpty(this.walletName) || !!this.walletNameError;
  }
  public showBackButton: boolean = INIT_VALUES.showBackButton;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;

    reaction(
      () => this.walletName,
      () => chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.VALIDATE_WALLET_NAME,
        name: this.walletName,
      }, (response: any) => this.walletNameTaken = response),
    );
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)

  @action
  public routeToSaveMnemonic = () => {
    this.app.routerStore.push('/save-mnemonic');
  }

  @action
  public routeToImportWallet = () => {
    this.app.routerStore.push('/import-wallet');
  }
}
