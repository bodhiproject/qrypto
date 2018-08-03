import { Insight } from 'qtumjs-wallet';
import { map, find, partition, sumBy, includes } from 'lodash';
import moment from 'moment';

import Background from '.';
import { MESSAGE_TYPE } from '../constants';
import Transaction from '../models/Transaction';

export default class TransactionBackground {
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
    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.bg.onInitFinished('transaction');
  }

  /*
  * Fetches the first page of transactions.
  */
  public fetchFirst = async () => {
    this.transactions = await this.fetchTransactions(0);
    this.sendTransactionsMessage();
  }

  /*
  * Fetches the more transactions based on pageNum.
  */
  public fetchMore = async () => {
    this.pageNum = this.pageNum + 1;
    const txs = await this.fetchTransactions(this.pageNum);
    this.transactions = this.transactions.concat(txs);
    this.sendTransactionsMessage();
  }

  /*
  * Stops polling for the periodic info updates.
  */
  public stopPolling = () => {
    if (this.getTransactionsInterval) {
      clearInterval(this.getTransactionsInterval);
      this.getTransactionsInterval = undefined;
      this.pageNum = 0;
    }
  }

  // TODO: if a new transaction comes in, the transactions on a page will shift(ie if 1 page has 10 transactions,
  // transaction number 10 shifts to page2), and the bottom most transaction would disappear from the list.
  // Need to add some additional logic to keep the bottom most transaction displaying.
  private refreshTransactions = async () => {
    let refreshedItems: Transaction[] = [];
    for (let i = 0; i <= this.pageNum; i++) {
      refreshedItems = refreshedItems.concat(await this.fetchTransactions(i));
    }
    this.transactions = refreshedItems;
    this.sendTransactionsMessage();
  }

  /*
  * Starts polling for periodic info updates.
  */
  private startPolling = async () => {
    this.fetchFirst();
    if (!this.getTransactionsInterval) {
      this.getTransactionsInterval = window.setInterval(() => {
        this.refreshTransactions();
      }, TransactionBackground.GET_TX_INTERVAL_MS);
    }
  }

  /*
  * Fetches the transactions of the current wallet instance.
  * @param pageNum The page of transactions to fetch.
  * @return The Transactions array.
  */
  private fetchTransactions = async (pageNum: number = 0): Promise<Transaction[]> => {
    if (!this.bg.account.loggedInAccount || !this.bg.account.loggedInAccount.qjsWallet) {
      console.error('Cannot get transactions without wallet instance.');
      return [];
    }

    const wallet = this.bg.account.loggedInAccount.qjsWallet;
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

  /*
  * Sends the message after fetching transactions.
  */
  private sendTransactionsMessage = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPE.GET_TXS_RETURN,
      transactions: this.transactions,
      hasMore: this.hasMore,
    });
  }

  private handleMessage = (request: any) => {
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
