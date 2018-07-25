import { WalletRPCProvider, Insight } from 'qtumjs-wallet';
import { find } from 'lodash';
const { Contract, Decoder } = require('qweb3');

import Background from '.';

const INIT_VALUES = {
  rpcProvider: undefined,
};

export default class RPCBackground {
  private bg: Background;
  private rpcProvider?: WalletRPCProvider = INIT_VALUES.rpcProvider;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.onMessage);
    this.bg.onInitFinished('rpc');
  }

  public createRpcProvider = async () => {
    const wallet = this.bg.wallet.wallet;
    if (wallet) {
      this.rpcProvider = new WalletRPCProvider(wallet);
    }
  }

  public reset = () => {
    Object.assign(this, INIT_VALUES);
  }

  public callContract = async (contractAddress: string, abi: any[], methodName: string, args: any[]): Promise<any> => {
    if (this.rpcProvider) {
      const contract = new Contract('', contractAddress, abi);
      const methodObj = find(contract.abi, { name: methodName });
      const dataHex = contract.constructDataHex(methodObj, args);

      let res: Insight.IContractCall = await this.rpcProvider.rawCall('callContract', [
        contract.address,
        dataHex,
      ]) as Insight.IContractCall;
      res = Decoder.decodeCall(res, contract.abi, methodName);
      return res;
    }

  }

  private onMessage = (request: any) => {
    switch (request.type) {
      default:
        break;
    }
  }
}
