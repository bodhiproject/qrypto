import { observable, action, reaction } from 'mobx';
const extension = require('extensionizer');

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
    extension.runtime.onMessage.addListener(this.handleMessage);
    this.activeTabIdx === 0 ? this.onTransactionTabSelected() : this.onTokenTabSelected();
  }

  public deinit = () => {
    extension.runtime.onMessage.removeListener(this.handleMessage);
    extension.runtime.sendMessage({ type: MESSAGE_TYPE.STOP_TX_POLLING });
  }

  public fetchMoreTxs = () => {
    extension.runtime.sendMessage({ type: MESSAGE_TYPE.GET_MORE_TXS });
  }

  public onTransactionClick = (txid: string) => {
    extension.runtime.sendMessage({ type: MESSAGE_TYPE.GET_NETWORK_EXPLORER_URL }, (response: any) => {
      extension.tabs.create({ url: `${response}/${txid}` });
    });
  }

  public removeToken = (contractAddress: string) => {
    extension.runtime.sendMessage({
      type: MESSAGE_TYPE.REMOVE_TOKEN,
      contractAddress,
    });
  }

  public routeToAddToken = () => {
    this.app.routerStore.push('/add-token');
  }

  private onTransactionTabSelected = () => {
    extension.runtime.sendMessage({ type: MESSAGE_TYPE.START_TX_POLLING });
  }

  private onTokenTabSelected = () => {
    extension.runtime.sendMessage({ type: MESSAGE_TYPE.GET_QRC_TOKEN_LIST }, (response: any) => {
      this.tokens = response;
    });
    extension.runtime.sendMessage({ type: MESSAGE_TYPE.STOP_TX_POLLING });
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
