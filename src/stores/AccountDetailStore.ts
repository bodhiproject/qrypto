import { observable, action } from 'mobx';
import {  Wallet, Insight } from 'qtumjs-wallet';
import _ from 'lodash';
import moment from 'moment';

import Transaction from '../models/Transaction';

export default class AccountDetailStore {
  @observable public activeTabIdx: number = 0;
  @observable.shallow public items: Transaction[] = [];

  @action
  public async loadFromWallet(wallet: Wallet) {
    const { txs } =  await wallet.getTransactions();

    this.items = txs.map((tx: Insight.IRawTransactionInfo) => {
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
