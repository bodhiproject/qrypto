import { observable, action } from 'mobx';
import { Insight } from 'qtumjs-wallet';

import { MESSAGE_TYPE } from '../constants';

const INIT_VALUES = {
  info: undefined,
};

export default class HomeStore {
  @observable public info?: Insight.IGetInfo = INIT_VALUES.info;

  @action
  public init = () => {
    chrome.runtime.onMessage.addListener(this.handleMessage);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_WALLET_INFO }, (response: any) => this.info = response);
  }

  @action
  private handleMessage = (request: any) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_WALLET_INFO_RETURN:
        this.info = request.info;
        break;
      default:
        break;
    }
  }
}
