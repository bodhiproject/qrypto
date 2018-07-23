import { Insight } from 'qtumjs-wallet';
import { map, find, partition, sumBy, includes } from 'lodash';
import moment from 'moment';

import Background from '.';
import { MESSAGE_TYPE } from '../constants';
import Transaction from '../models/Transaction';

export default class AccountDetailBackground {
  private static GET_TX_INTERVAL_MS: number = 60000;

  public transactions: Transaction[] = [];
  public pageNum: number = 0;
  public pagesTotal?: number;
  public get hasMore(): boolean {
    return !!this.pagesTotal && (this.pagesTotal > this.pageNum + 1);
  }

  private bg: Background;
  private getTransactionsInterval?: number = undefined;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.onMessage);
  }

  public async fetchFirst() {
    this.transactions = await this.fetchTransactions(0);
    this.sendTransactionsMessage();
  }

  public async fetchMore() {
    this.pageNum = this.pageNum + 1;
    const txs = await this.fetchTransactions(this.pageNum);
    this.transactions = this.transactions.concat(txs);
    this.sendTransactionsMessage();
  }

  // TODO - if a new transaction comes in, the transactions on a page will shift(ie if 1 page has 10 transactions,
  // transaction number 10 shifts to page2), and the bottom most transaction would disappear from the list.
  // Need to add some additional logic to keep the bottom most transaction displaying.
  private async refreshTransactions() {
    let refreshedItems: Transaction[] = [];
    for (let i = 0; i <= this.pageNum; i++) {
      refreshedItems = refreshedItems.concat(await this.fetchTransactions(i));
    }
    this.transactions = refreshedItems;
    this.sendTransactionsMessage();
  }

  private startPolling = async () => {
    this.fetchFirst();
    this.getTransactionsInterval = window.setInterval(() => {
      this.refreshTransactions();
    }, AccountDetailBackground.GET_TX_INTERVAL_MS);
  }

  private stopPolling = () => {
    if (this.getTransactionsInterval) {
      clearInterval(this.getTransactionsInterval);
      this.pageNum = 0;
    }
  }

  private async fetchTransactions(pageNum: number = 0): Promise<Transaction[]> {
    const wallet = this.bg.wallet.wallet;
    if (!wallet) {
      throw Error('Trying to fetch transactions with undefined wallet instance.');
    }

    const { pagesTotal, txs } =  await wallet.getTransactions(pageNum);
    this.pagesTotal = pagesTotal;

    return map(txs, (tx: Insight.IRawTransactionInfo) => {
      const {
        txid,
        confirmations,
        time,
        vin,
        vout,
      } = tx;

      const sender = find(vin, {addr: wallet.address});
      const outs = map(vout, ({ value, scriptPubKey: { addresses } }) => {
        return { value, addresses };
      });
      const [mine, other] = partition(outs, ({ addresses }) => includes(addresses, wallet.address));
      const amount = sumBy(sender ? other : mine, ({ value }) => parseFloat(value));

      return new Transaction({
        id: txid,
        timestamp: moment(new Date(time * 1000)).format('MM-DD-YYYY, HH:mm'),
        confirmations,
        amount,
      });
    });
  }

  private sendTransactionsMessage = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPE.GET_TXS_RETURN,
      transactions: this.transactions,
      hasMore: this.hasMore,
    });
  }

  private onMessage = (request: any) => {
    switch (request.type) {
      case MESSAGE_TYPE.START_TX_POLLING:
        this.startPolling();
        break;
      case MESSAGE_TYPE.STOP_TX_POLLING:
        this.stopPolling();
        break;
      case MESSAGE_TYPE.GET_MORE_TXS:
        this.fetchMore();
        break;
      default:
        break;
    }
  }
}
