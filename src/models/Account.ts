import { observable, action } from 'mobx';
import { Wallet, Insight } from 'qtumjs-wallet';

import SubAccount from './SubAccount';
import Transaction from './Transaction';
import { ISigner } from '../types';

export default class Account implements ISigner {
  @observable public name: string;
  @observable public privateKeyHash: string;
  @observable public subAccounts: SubAccount[] = [];
  @observable public qjsWallet?: Wallet;
  @observable public info?: Insight.IGetInfo;
  @observable public qtumUSD?: number;

  constructor(name: string, privateKeyHash: string) {
    this.name = name;
    this.privateKeyHash = privateKeyHash;
  }

  @action
  public addSubAccount(account: SubAccount) {
    this.subAccounts.push(account);
  }

  @action
  public getInfo = async () => {
    if (!this.qjsWallet) {
      console.error('Cannot getInfo without wallet instance.');
    }
    this.info = await this.qjsWallet!.getInfo();
  }

  public send = async (to: string, amount: number): Promise<Insight.ISendRawTxResult> => {
    if (!this.qjsWallet) {
      throw Error('Cannot send without wallet instance.');
    }
    return await this.qjsWallet!.send(to, amount * 1e8, { feeRate: 4000 });
  }

  public signTransaction(address: string, transaction: Transaction): Transaction {
    // TODO: implement signing logic
    console.log(address, transaction);
    return null;
  }
}
