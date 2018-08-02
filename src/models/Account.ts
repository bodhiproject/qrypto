import { observable, action } from 'mobx';
import { Wallet, Insight } from 'qtumjs-wallet';

import SubAccount from './SubAccount';
import Transaction from './Transaction';
import { ISigner } from '../types';

export default class Account implements ISigner {
  @observable public name: string;
  @observable public privateKeyHash: string;
  @observable public subAccounts: SubAccount[] = [];
  @observable public wallet?: Wallet;

  constructor(name: string, privateKeyHash: string) {
    this.name = name;
    this.privateKeyHash = privateKeyHash;
  }

  @action
  public addSubAccount(account: SubAccount) {
    this.subAccounts.push(account);
  }

  public send = async (to: string, amount: number): Promise<Insight.ISendRawTxResult> => {
    if (!this.wallet) {
      throw Error('Cannot send. Wallet instance is not defined.');
    }
    return await this.wallet!.send(to, amount * 1e8, { feeRate: 4000 });
  }

  public signTransaction(address: string, transaction: Transaction): Transaction {
    // TODO: implement signing logic
    console.log(address, transaction);
    return null;
  }
}
