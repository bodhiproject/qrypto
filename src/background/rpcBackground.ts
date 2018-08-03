import { WalletRPCProvider, Insight } from 'qtumjs-wallet';
import { find } from 'lodash';
const { Contract, Decoder } = require('qweb3');

import Background from '.';
import { MESSAGE_TYPE } from '../constants';

const INIT_VALUES = {
  rpcProvider: undefined,
};

export default class RPCBackground {
  private bg: Background;
  private rpcProvider?: WalletRPCProvider = INIT_VALUES.rpcProvider;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.bg.onInitFinished('rpc');
  }

  /*
  * Creates the RPC provider instance. This should be initialized after the wallet instance has been created.
  */
  public createRpcProvider = async () => {
    if (this.bg.account.loggedInAccount && this.bg.account.loggedInAccount.qjsWallet) {
      this.rpcProvider = new WalletRPCProvider(this.bg.account.loggedInAccount.qjsWallet);
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

  /*
  * Executes a sendtocontract on the blockchain.
  * @param contractAddress The contract address of the contract.
  * @param abi The ABI of the contract.
  * @param methodName The method to call that is in the ABI.
  * @param args The arguments that are needed when calling the method.
  * @return The result of the callcontract.
  */
  public sendToContract = async (
    contractAddress: string,
    abi: any[],
    methodName: string,
    args: any[],
  ): Promise<Insight.ISendRawTxResult> => {
    if (!this.rpcProvider) {
      throw Error('Tried to sendToContract with no RPC provider.');
    }

    const contract = new Contract('', contractAddress, abi);
    const methodObj = find(contract.abi, { name: methodName });
    const dataHex = contract.constructDataHex(methodObj, args);

    const res: Insight.ISendRawTxResult = await this.rpcProvider.rawCall('sendToContract', [
      contract.address,
      dataHex,
    ]) as Insight.ISendRawTxResult;
    return res;
  }

  private callRpc = async (id: number, method: string, args: any[]) => {
    if (!this.rpcProvider) {
      console.error('Tried to callRpc with no RPC provider.');
      return;
    }

    const result = await this.rpcProvider.rawCall(method, args);
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, { type: MESSAGE_TYPE.RPC_CALL_RETURN, id, result });
    });
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.RPC_CALL:
        if (this.rpcProvider) {
          this.callRpc(request.id, request.method, request.args);
          sendResponse(true);
        } else {
          sendResponse(false);
        }
        break;
      default:
        break;
    }
  }
}
