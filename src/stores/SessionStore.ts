import { observable, action } from 'mobx';
import { Insight } from 'qtumjs-wallet';

import { MESSAGE_TYPE } from '../constants';

const INIT_VALUES = {
  loggedInAccount: undefined,
  info: undefined,
  qtumBalanceUSD: undefined,
};

export default class SessionStore {
  @observable public loggedInAccount?: Account = INIT_VALUES.loggedInAccount;
  @observable public info?: Insight.IGetInfo = INIT_VALUES.info;
  @observable public qtumBalanceUSD?: string = undefined;

  constructor() {
    chrome.runtime.onMessage.addListener(this.handleMessage);
  }

  @action
  public init = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_LOGGED_IN_ACCOUNT }, (response: any) => {
      this.loggedInAccount = response;
    });
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_WALLET_INFO }, (response: any) => this.info = response);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_QTUM_BALANCE_USD }, (response: any) => {
      this.qtumBalanceUSD = response;
    });
  }

  @action
  private handleMessage = (request: any) => {
    switch (request.type) {
      case MESSAGE_TYPE.ACCOUNT_LOGIN_SUCCESS:
        this.init();
        break;
      case MESSAGE_TYPE.GET_WALLET_INFO_RETURN:
        this.info = request.info;
        break;
      case MESSAGE_TYPE.GET_QTUM_PRICE_RETURN:
        this.qtumBalanceUSD = request.qtumBalanceUSD;
        break;
      default:
        break;
    }
  }
}
