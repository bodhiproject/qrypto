import { observable, action, computed } from 'mobx';
import { Insight } from 'qtumjs-wallet';
import { find, map, sumBy, partition, includes } from 'lodash';
import moment from 'moment';

import AppStore from './AppStore';
import Transaction from '../models/Transaction';

export default class AccountDetailStore {
  private static GET_TX_INTERVAL_MS: number = 60000;

  @observable public activeTabIdx: number = 0;
  @observable.shallow public items: Transaction[] = [];
  @observable public pageNum: number = 0;
  @observable public pagesTotal?: number;

  @computed public get hasMore(): boolean {
    return !!this.pagesTotal && (this.pagesTotal > this.pageNum + 1);
  }

  private getTransactionsInterval?: number = undefined;

  constructor(private app: AppStore) {}

  @action public async loadFromWallet() {
    this.items = await this.load();
  }

  @action public async loadMore() {
    this.pageNum = this.pageNum + 1;
    const txs = await this.load(this.pageNum);
    this.items = this.items.concat(txs);
  }

  public startTxPolling = () => {
    this.loadFromWallet();
    this.getTransactionsInterval = window.setInterval(() => {
      this.refreshTransactions();
    }, AccountDetailStore.GET_TX_INTERVAL_MS);
  }

  @action public stopTxPolling = () => {
    if (this.getTransactionsInterval) {
      clearInterval(this.getTransactionsInterval);
      this.pageNum = 0;
    }
  }

  // TODO - if a new transaction comes in, the transactions on a page will shift(ie if 1 page has 10 transactions, transaction number 10 shifts to page2), and the bottom most transaction would disappear from the list. Need to add some additional logic to keep the bottom most transaction displaying.
  @action public async refreshTransactions() {
    let refreshedItems: Transaction[] = [];
    for (let i = 0; i <= this.pageNum; i++) {
      refreshedItems = refreshedItems.concat(await this.load(i));
    }
    this.items = refreshedItems;
  }

  @action private async load(pageNum: number = 0): Promise<Transaction[]> {
    const wallet = this.app.walletStore.wallet!;
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

}
