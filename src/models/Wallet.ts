import { action } from 'mobx';
import { Wallet as QtumWallet, Insight, WalletRPCProvider } from 'qtumjs-wallet';
import { TRANSACTION_SPEED } from '../constants';

import { ISigner } from '../types';
import { RPC_METHOD } from '../constants';

export default class Wallet implements ISigner {
  public qjsWallet?: QtumWallet;
  public rpcProvider?: WalletRPCProvider;
  public info?: Insight.IGetInfo;
  public qtumUSD?: number;

  constructor(qjsWallet: QtumWallet) {
    this.qjsWallet = qjsWallet;
    this.rpcProvider = new WalletRPCProvider(this.qjsWallet);
  }

  @action
  public getInfo = async () => {
    if (!this.qjsWallet) {
      console.error('Cannot getInfo without qjsWallet instance.');
    }
    this.info = await this.qjsWallet!.getInfo();
  }

  /*
  * @param amount: (unit - whole QTUM)
  */
  public send = async (to: string, amount: number, transactionSpeed: string): Promise<Insight.ISendRawTxResult> => {
    if (!this.qjsWallet) {
      throw Error('Cannot send without wallet.');
    }

    /*
    * TODO - As of 9/21/18 there is no congestion in the network and we are under
    * capacity, so we are setting the same base fee rate for all transaction speeds.
    * In the future if traffic changes, we will set different fee rates.
    */
    let feeRate; // satoshi/byte; 500 satoshi/byte == .005 QTUM/KB
    if (transactionSpeed === TRANSACTION_SPEED.FAST) {
      feeRate = 500;
    } else if (transactionSpeed === TRANSACTION_SPEED.SLOW) {
      feeRate = 500;
    } else {
      // transactionSpeed == TRANSACTION_SPEED.NORMAL
      feeRate = 500;
    }

    // convert amount units from whole QTUM => SATOSHI QTUM
    return await this.qjsWallet!.send(to, amount * 1e8, { feeRate });
  }

  public sendTransaction = async (args: any[]): Promise<any> => {
    if (!this.rpcProvider) {
      throw Error('Cannot sign transaction without RPC provider.');
    }
    if (args.length < 2) {
      throw Error('Requires first two arguments: contractAddress and data.');
    }

    try {
      return await this.rpcProvider!.rawCall(RPC_METHOD.SEND_TO_CONTRACT, args);
    } catch (err) {
      throw err;
    }
  }
}
