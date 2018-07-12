import { networks } from 'qtumjs-wallet';
import { observable, computed } from 'mobx';

import AppStore from './AppStore';

const NETWORK_NAMES = {
  TESTNET: 'TestNet',
  MAINNET: 'MainNet',
};
export const NetworkNamesArray = [NETWORK_NAMES.MAINNET, NETWORK_NAMES.TESTNET];
const NetworksArray = [networks.mainnet, networks.testnet];

export default class NetworkStore {
  @observable public networkIndex = 1;

  @computed public get networkName() {
    return NetworkNamesArray[this.networkIndex];
  }

  @computed public get network(): any {
    return NetworksArray[this.networkIndex];
  }

  @computed public get isMainNet(): boolean {
     return this.networkIndex === 0;
  }

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
    window.networkIndex = this.networkIndex;
  }

  public changeNetwork(networkIndex: number) {
    if (this.networkIndex !== networkIndex) {
      this.networkSwitchInProcess = true;
      window.networkIndex = this.networkIndex;
      this.networkIndex = networkIndex;
      // we dont call walletStore.logout() because we don't want to run this.app.routerStore.push('/login') until after getChromeStorage() has finished running
      this.app.walletStore.resetWithNetwork();
      this.app.walletStore.getChromeStorage();
    }
  }
}
