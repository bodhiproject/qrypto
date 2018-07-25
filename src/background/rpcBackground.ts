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
    this.bg.onInitFinished('rpc');
  }

  /*
  * Creates the RPC provider instance. This should be initialized after the wallet instance has been created.
  */
  public createRpcProvider = async () => {
    const wallet = this.bg.wallet.wallet;
    if (wallet) {
      this.rpcProvider = new WalletRPCProvider(wallet);
    }
  }

  /*
  * Resets the values.
  */
  public reset = () => {
    Object.assign(this, INIT_VALUES);
  }

  /*
  * Executes a callcontract on the blockchain.
  * @param contractAddress The contract address of the contract.
  * @param abi The ABI of the contract.
  * @param methodName The method to call that is in the ABI.
  * @param args The arguments that are needed when calling the method.
  * @return The result of the callcontract.
  */
  public callContract = async (contractAddress: string, abi: any[], methodName: string, args: any[]): Promise<any> => {
    if (!this.rpcProvider) {
      throw Error('Tried to callContract with no RPC provider.');
    }

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
