import { observable, action } from 'mobx';

import { MESSAGE_TYPE } from '../../../constants';
import QryNetwork from '../../../models/QryNetwork';
import AppStore from '../AppStore';

const INIT_VALUES = {
  networks: [],
};

export default class NavBarStore {
  @observable public networks: QryNetwork[] = INIT_VALUES.networks;
  @observable public settingsMenuAnchor?: string = undefined;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_NETWORKS }, (response: any) => this.networks = response);
  }

  public routeToSettings = () => {
    this.app.routerStore.push('/settings');
  }

  @action
  public changeNetwork = (index: number) => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.CHANGE_NETWORK, networkIndex: index });
  }

  @action
  public logout = () => {
    this.app.routerStore.push('/loading');
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGOUT });
  }
}
