import { observable, action } from 'mobx';
import { findIndex } from 'lodash';

import { MESSAGE_TYPE } from '../../constants';
import Transaction from '../../models/Transaction';
import QRCToken from '../../models/QRCToken';

const INIT_VALUES = {
  activeTabIdx: 0,
  transactions: [],
  tokens: [],
  hasMore: false,
};

export default class AccountDetailStore {
  @observable public activeTabIdx: number = INIT_VALUES.activeTabIdx;
  @observable public transactions: Transaction[] = INIT_VALUES.transactions;
  @observable public tokens: QRCToken[] = INIT_VALUES.tokens;
  @observable public hasMore: boolean = INIT_VALUES.hasMore;

  @action
  public init = () => {
    chrome.runtime.onMessage.addListener(this.handleMessage);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.START_TX_POLLING });
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_QRC_TOKEN_LIST }, (response: any) => {
      this.tokens = response;
    });
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_QRC_TOKEN_BALANCES });
  }

  public deinit = () => {
    chrome.runtime.onMessage.removeListener(this.handleMessage);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.STOP_TX_POLLING });
  }

  public fetchMore = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_MORE_TXS });
  }

  @action
  private updateToken = (token: QRCToken) => {
    const index = findIndex(this.tokens, { name: token.name, abbreviation: token.abbreviation });
    if (index !== -1) {
      this.tokens[index] = token;
    }
  }

  @action
  private handleMessage = (request: any) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_TXS_RETURN:
        this.transactions = request.transactions;
        this.hasMore = request.hasMore;
        break;
      case MESSAGE_TYPE.GET_QRC_TOKEN_BALANCES_RETURN:
        this.updateToken(request.token);
        break;
      default:
        break;
    }
  }
}
