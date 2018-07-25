import { observable, action } from 'mobx';

import { MESSAGE_TYPE } from '../../constants';
import Transaction from '../../models/Transaction';
import QRCToken from '../../models/QRCToken';
import testnetTokenList from '../../contracts/testnetTokenList';

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

    this.tokens = testnetTokenList;
  }

  public deinit = () => {
    chrome.runtime.onMessage.removeListener(this.handleMessage);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.STOP_TX_POLLING });
  }

  public fetchMore = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_MORE_TXS });
  }

  @action
  private handleMessage = (request: any) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_TXS_RETURN:
        this.transactions = request.transactions;
        this.hasMore = request.hasMore;
        break;
      default:
        break;
    }
  }
}
