import { observable, action, computed } from 'mobx';
import { Insight } from 'qtumjs-wallet';
import { find, map, sumBy, partition, includes } from 'lodash';
import moment from 'moment';

import AppStore from './AppStore';
import Transaction from '../models/Transaction';

export default class AccountDetailStore {
  @observable public activeTabIdx: number = 0;
  @observable.shallow public items: Transaction[] = [];
  @observable public pageNum: number = 0;
  @observable public pagesTotal?: number;

  constructor(private app: AppStore) {}

  @computed public get hasMore(): boolean {
    return !!this.pagesTotal && (this.pagesTotal > this.pageNum + 1);
 }

  @action public async loadFromWallet() {
    this.items = await this.load();
  }

  @action public async loadMore() {
    const txs = await this.load(this.pageNum + 1);

    this.items = this.items.concat(txs);
  }

  @action private async load(pageNum: number = 0): Promise<Transaction[]> {
    const wallet = this.app.walletStore.wallet!;
    const { pagesTotal, txs } =  await wallet.getTransactions(pageNum);

    this.pagesTotal = pagesTotal;
    this.pageNum = pageNum;

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
