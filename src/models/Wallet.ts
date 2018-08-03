import { action } from 'mobx';
import { Wallet as QtumWallet, Insight } from 'qtumjs-wallet';

import Transaction from './Transaction';
import { ISigner } from '../types';

export default class Wallet implements ISigner {
  public qjsWallet?: QtumWallet;
  public info?: Insight.IGetInfo;
  public qtumUSD?: number;

  constructor(qjsWallet: QtumWallet) {
    this.qjsWallet = qjsWallet;
  }

  @action
  public getInfo = async () => {
    if (!this.qjsWallet) {
      console.error('Cannot getInfo without qjsWallet instance.');
    }
    this.info = await this.qjsWallet!.getInfo();
  }

  public send = async (to: string, amount: number): Promise<Insight.ISendRawTxResult> => {
    if (!this.qjsWallet) {
      throw Error('Cannot send without qjsWallet instance.');
    }
    return await this.qjsWallet!.send(to, amount * 1e8, { feeRate: 4000 });
  }

  public signTransaction(address: string, transaction: Transaction): Transaction {
    // TODO: implement signing logic
    console.log(address, transaction);
    return null;
  }
}
