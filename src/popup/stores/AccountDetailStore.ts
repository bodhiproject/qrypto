import { observable, action, reaction } from 'mobx';

import AppStore from './AppStore';
import { MESSAGE_TYPE } from '../../constants';
import Transaction from '../../models/Transaction';
import QRCToken from '../../models/QRCToken';

const INIT_VALUES = {
  activeTabIdx: 0,
  transactions: [],
  tokens: [],
  hasMore: false,
  shouldScrollToBottom: false,
  editTokenMode: false,
};

export default class AccountDetailStore {
  @observable public activeTabIdx: number = INIT_VALUES.activeTabIdx;
  @observable public transactions: Transaction[] = INIT_VALUES.transactions;
  @observable public tokens: QRCToken[] = INIT_VALUES.tokens;
  @observable public hasMore: boolean = INIT_VALUES.hasMore;
  @observable public shouldScrollToBottom: boolean = INIT_VALUES.shouldScrollToBottom;
  @observable public editTokenMode: boolean = INIT_VALUES.editTokenMode;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
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

  public onTransactionClick = (txid: string) => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_NETWORK_EXPLORER_URL }, (response: any) => {
      chrome.tabs.create({ url: `${response}/${txid}` });
    });
  }

  public removeToken = (contractAddress: string) => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPE.REMOVE_TOKEN,
      contractAddress,
    });
  }

  public routeToAddToken = () => {
    this.app.routerStore.push('/add-token');
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
      case MESSAGE_TYPE.QRC_TOKENS_RETURN:
        this.tokens = request.tokens;
        break;
      default:
        break;
    }
  }
}
