import { observable, action, reaction } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';
import { MESSAGE_TYPE } from '../constants';

const INIT_VALUES = {
  selectedWalletName: '',
};

export default class AccountLoginStore {
  @observable public selectedWalletName: string = INIT_VALUES.selectedWalletName;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;

    // Set the default selected account on the login page.
    reaction(
      () => this.app.networkStore.networkIndex,
      () => this.setSelectedWallet(),
    );
  }

  @action
  public setSelectedWallet = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_ACCOUNTS }, (response: any) => {
      if (!isEmpty(response)) {
        this.selectedWalletName = response[0].name;
      }
    });
  }

  @action
  public routeToCreateWallet = () => {
    this.app.createWalletStore.showBackButton = true;
    this.app.routerStore.push('/create-wallet');
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}
