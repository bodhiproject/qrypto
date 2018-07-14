import { networks, Network as QjswNetwork } from 'qtumjs-wallet';
import { observable, computed } from 'mobx';

import AppStore from './AppStore';
import { NETWORK_NAMES } from '../constants';
import QryNetwork from '../models/QryNetwork';

export default class NetworkStore {
  @observable public networkIndex: number = 1;
  @computed public get network(): QjswNetwork  {
    return this.networksArray[this.networkIndex].network;
  }
  @computed public get isMainNet(): boolean {
     return this.networkIndex === 0;
  }
  public networksArray: QryNetwork[];

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;

    const mainnet = new QryNetwork(NETWORK_NAMES.MAINNET, networks.mainnet);
    const testnet = new QryNetwork(NETWORK_NAMES.TESTNET, networks.testnet);
    this.networksArray = [mainnet, testnet];
  }

  public changeNetwork(networkIndex: number) {
    if (this.networkIndex !== networkIndex) {
      this.networkIndex = networkIndex;
      this.app.walletStore.logout();
    }
  }
}
