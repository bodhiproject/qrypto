import { observable, action } from 'mobx';

import { MESSAGE_TYPE } from '../../constants';
import QryNetwork from '../../models/QryNetwork';
import AppStore from '../AppStore';

const INIT_VALUES = {
  networks: [],
  networkIndex: 1,
};

export default class NavBarStore {
  @observable public networks: QryNetwork[] = INIT_VALUES.networks;
  @observable public networkIndex: number = INIT_VALUES.networkIndex;
  @observable public settingsMenuAnchor?: string = undefined;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_NETWORKS }, (response: any) => this.networks = response);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_NETWORK_INDEX }, (response: any) => {
      if (response !== undefined) {
        this.networkIndex = response;
      }
    });
  }

  @action
  public changeNetwork = (index: number) => {
    this.networkIndex = index;
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.CHANGE_NETWORK, networkIndex: index });
  }

  @action
  public logout = () => {
    this.app.routerStore.push('/loading');
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGOUT });
  }
}
