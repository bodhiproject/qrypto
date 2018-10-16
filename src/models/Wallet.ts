import { action } from 'mobx';
import { Wallet as QtumWallet, Insight, WalletRPCProvider } from 'qtumjs-wallet';

import { ISigner } from '../types';
import { ISendTxOptions } from 'qtumjs-wallet/lib/tx';
import { RPC_METHOD } from '../constants';
import { resolve } from 'path';

export default class Wallet implements ISigner {
  public qjsWallet?: QtumWallet;
  public rpcProvider?: WalletRPCProvider;
  public info?: Insight.IGetInfo;
  public qtumUSD?: number;
  public maxSendAmount?: number;

  constructor(qjsWallet: QtumWallet) {
    this.qjsWallet = qjsWallet;
    this.rpcProvider = new WalletRPCProvider(this.qjsWallet);
  }

  @action
  public getInfo = async () => {
    if (!this.qjsWallet) {
      console.error('Cannot getInfo without qjsWallet instance.');
    }
    console.log('getting info');
    this.info = await this.qjsWallet!.getInfo();
    console.log('getting info complete');
  }

  // @param amount: (unit - whole QTUM)
  public send = async (to: string, amount: number, options: ISendTxOptions): Promise<Insight.ISendRawTxResult> => {
    if (!this.qjsWallet) {
      throw Error('Cannot send without wallet.');
    }

    // convert amount units from whole QTUM => SATOSHI QTUM
    return await this.qjsWallet!.send(to, amount * 1e8, { feeRate: options.feeRate });
  }

  public calcMaxSendAmount = async (feeRate: number) => {
    if (!this.qjsWallet || !this.info) {
      throw Error('Cannot calculate max send amount without wallet or this.info.');
    }
    console.log('calculating max send amount');
    // TODO fix hardcoding
    // let maxTries = 100
    const maxTries = 100;
    let tries = 0;
    // let decrement = .01
    const decrement = 0.01;
    const bal = this.info.balance;
    // let maxQtumSend = await this.tryGenerate(feeRate, this.info.balance, .001, maxTries)
    // return maxQtumSend

    // return await this.qjsWallet!.generateTx('qLJsx41F8Uv1KFF3RbrZfdLnyWQzvPdeF9', (bal - .3) * 1e8, { feeRate: feeRate })

    // await this.qjsWallet!.generateTx('qLJsx41F8Uv1KFF3RbrZfdLnyWQzvPdeF9', (sendAmount) * 1e8, { feeRate: 500 })

    let spread = 0;
    // let spread = decrement
    while (maxTries > tries) {
      try {
        tries++;
        // console.log("tries", tries)
        // await this.qjsWallet!.generateTx('qLJsx41F8Uv1KFF3RbrZfdLnyWQzvPdeF9', (bal - spread) * 1e8, { feeRate: feeRate })
        console.log('************RUNS FAST MULTIPLE TIMES********** tries', tries);
        await this.qjsWallet!.generateTx('qLJsx41F8Uv1KFF3RbrZfdLnyWQzvPdeF9', (bal - spread) * 1e8, { feeRate });

        console.log('*******RUNS A LOT LATER*******');
        // .then(() =>
        //   {
        //     console.log("accepted spread2", spread)
        //     console.log("maxSendAmount2", bal - spread)
        //     resolve((bal - spread).toString())
        //   }
        // )
        // .reject(() => {})
        console.log('accepted spread', spread);
        console.log('maxSendAmount', bal - spread);
        return bal - spread;
        // resolve(bal - spread)
      } catch (err) {
        console.log('err', err);
        spread = spread + decrement;
        console.log('catching, spread', spread);
      }
    }
    // throw Error("unable to calculate max send amount")
  }

  // private tryGenerate = async (feeRate: number, bal:number, decrement:number, maxTries:number) => {

  //   let spread = 0
  //   while (maxTries > 0) {
  //     try {

  //       await this.qjsWallet!.generateTx('qLJsx41F8Uv1KFF3RbrZfdLnyWQzvPdeF9', (bal - spread) * 1e8, { feeRate: feeRate })
  //       console.log("maxSendAmount", bal - spread)
  //       return bal - spread
  //     } catch {
  //       spread = spread + decrement
  //     }
  //   }
  //   throw Error("unable to calculate max send amount")
  // }

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
