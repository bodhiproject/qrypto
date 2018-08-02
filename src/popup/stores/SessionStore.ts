import { observable, action } from 'mobx';

import { MESSAGE_TYPE } from '../../constants';
import Account from '../../models/Account';

const INIT_VALUES = {
  networkIndex: 1,
  loggedInAccount: undefined,
};

export default class SessionStore {
  @observable public networkIndex: number = INIT_VALUES.networkIndex;
  @observable public loggedInAccount?: Account = INIT_VALUES.loggedInAccount;

  constructor() {
    chrome.runtime.onMessage.addListener(this.handleMessage);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_NETWORK_INDEX }, (response: any) => {
      if (response !== undefined) {
        this.networkIndex = response;
      }
    });
  }

  @action
  public init = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_LOGGED_IN_ACCOUNT }, (response: any) => {
      this.loggedInAccount = response;
    });
  }

  @action
  private handleMessage = (request: any) => {
    switch (request.type) {
      case MESSAGE_TYPE.CHANGE_NETWORK_SUCCESS:
        this.networkIndex = request.networkIndex;
        break;
      case MESSAGE_TYPE.ACCOUNT_LOGIN_SUCCESS:
        this.init();
        break;
      case MESSAGE_TYPE.GET_WALLET_INFO_RETURN:
        this.loggedInAccount = request.loggedInAccount;
        break;
      default:
        break;
    }
  }
}
