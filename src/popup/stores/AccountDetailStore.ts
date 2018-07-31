import { observable, action, reaction } from 'mobx';

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

  constructor() {
    reaction(
      () => this.activeTabIdx,
      () => this.activeTabIdx === 0 ? this.onTransactionTabSelected() : this.onTokenTabSelected(),
    );
  }

  @action
  public init = () => {
    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.activeTabIdx === 0 ? this.onTransactionTabSelected() : this.onTokenTabSelected();
  }

  public deinit = () => {
    chrome.runtime.onMessage.removeListener(this.handleMessage);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.STOP_TX_POLLING });
  }

  public fetchMoreTxs = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_MORE_TXS });
  }

  private onTransactionTabSelected = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.START_TX_POLLING });
  }

  private onTokenTabSelected = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_QRC_TOKEN_LIST }, (response: any) => {
      this.tokens = response;
    });
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.STOP_TX_POLLING });
  }

  @action
  private handleMessage = (request: any) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_TXS_RETURN:
        this.transactions = request.transactions;
        this.hasMore = request.hasMore;
        break;
      case MESSAGE_TYPE.QRC_TOKEN_BALANCES_RETURN:
        this.tokens = request.tokens;
        break;
      default:
        break;
    }
  }
}
