import { observable, action } from 'mobx';
import {  Wallet, Insight } from 'qtumjs-wallet';
import _ from 'lodash';
import moment from 'moment';

import Transaction from '../models/Transaction';

export default class AccountDetailStore {
  @observable public activeTabIdx: number = 0;
  @observable.shallow public items: Transaction[] = [];
  @observable public pageNum: number = 0;
  @observable public pagesTotal?: number;

  private wallet?: Wallet;

  @action public async loadFromWallet(wallet: Wallet) {
    this.items = await this.load(wallet);
  }

  @action public async loadMore() {
    const txs = await this.load(this.wallet!, this.pageNum + 1);

    this.items = this.items.concat(txs);
  }

  @action private async load(wallet: Wallet, pageNum: number = 0): Promise<Transaction[]> {
    this.wallet = wallet;

    const { pagesTotal, txs } =  await wallet.getTransactions(pageNum);

    this.pagesTotal = pagesTotal;
    this.pageNum = pageNum;

    return txs.map((tx: Insight.IRawTransactionInfo) => {
      const {
        txid,
        confirmations,
        time,
        vin,
        vout,
      } = tx;

      const sender = _.find(vin, {addr: wallet.address});

      const outs = _.map(vout, ({ value, scriptPubKey: { addresses } }) => {
        return { value, addresses };
      });

      const [mine, other] = _.partition(outs, ({ addresses }) => _.includes(addresses, wallet.address));

      const amount = _.sumBy(sender ? other : mine, ({ value }) => parseFloat(value));

      return new Transaction({
        id: txid,
        timestamp: moment(new Date(time * 1000)).format('MM-DD-YYYY, HH:mm'),
        confirmations,
        amount,
      });
    });
  }

}
