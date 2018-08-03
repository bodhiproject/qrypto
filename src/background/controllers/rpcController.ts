import { WalletRPCProvider, Insight } from 'qtumjs-wallet';
import { find } from 'lodash';
const { Contract, Decoder } = require('qweb3');

import QryptoController from '.';
import IController from './iController';
import { MESSAGE_TYPE } from '../../constants';
import { IRPCRequestPayload } from '../../types';

const INIT_VALUES = {
  rpcProvider: undefined,
};

export default class RPCController extends IController {
  private static DEFAULT_AMOUNT = 0;
  private static DEFAULT_GAS_LIMIT = 200000;
  private static DEFAULT_GAS_PRICE = 40;

  private rpcProvider?: WalletRPCProvider = INIT_VALUES.rpcProvider;

  constructor(main: QryptoController) {
    super('rpc', main);

    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.initFinished();
  }

  /*
  * Creates the RPC provider instance. This should be initialized after the wallet instance has been created.
  */
  public createRpcProvider = async () => {
    if (this.main.account.loggedInAccount
      && this.main.account.loggedInAccount.wallet
      && this.main.account.loggedInAccount.wallet.qjsWallet
    ) {
      this.rpcProvider = new WalletRPCProvider(this.main.account.loggedInAccount.wallet.qjsWallet);
    }
  }

  /*
  * Resets the values.
  */
  public reset = () => {
    Object.assign(this, INIT_VALUES);
  }

  /*
  * Constructs the encoded data hex for a sendtocontract or callcontract.
  * @param abi The ABI of the contract.
  * @param methodName The method to call that is in the ABI.
  * @param args The arguments that are needed when calling the method.
  * @return The constructed data hex.
  */
  public encodeDataHex = (abi: any[], methodName: string, args: any[]) => {
    const contract = new Contract('', '', abi);
    const methodObj = find(contract.abi, { name: methodName });
    return contract.constructDataHex(methodObj, args);
  }

  /*
  * Executes a callcontract on the blockchain.
  * @param payload The RPC request payload.
  * @return The result of the callcontract.
  */
  public callContract = async (payload: IRPCRequestPayload): Promise<any> => {
    if (!this.rpcProvider) {
      throw Error('Tried to callContract with no RPC provider.');
    }

    const data = this.encodeDataHex(payload.abi, payload.methodName, payload.args);
    const res = await this.rpcProvider.rawCall('callContract', [
      payload.contractAddress,
      data,
      payload.amount,
      payload.gasLimit,
      payload.gasPrice,
    ]) as Insight.IContractCall;
    return Decoder.decodeCall(res, payload.abi, payload.methodName);
  }

  /*
  * Executes a sendtocontract on the blockchain.
  * @param contractAddress The contract address of the contract.
  * @param abi The ABI of the contract.
  * @param methodName The method to call that is in the ABI.
  * @param args The arguments that are needed when calling the method.
  * @return The result of the callcontract.
  */
  public sendToContract = async (payload: IRPCRequestPayload): Promise<Insight.ISendRawTxResult> => {
    if (!this.rpcProvider) {
      throw Error('Tried to sendToContract with no RPC provider.');
    }

    const { contractAddress, abi, methodName, args, amount, gasLimit, gasPrice } = payload;
    const data = this.encodeDataHex(abi, methodName, args);
    const res: Insight.ISendRawTxResult = await this.rpcProvider.rawCall('sendToContract', [
      contractAddress,
      data,
      amount || RPCController.DEFAULT_AMOUNT,
      gasLimit || RPCController.DEFAULT_GAS_LIMIT,
      gasPrice || RPCController.DEFAULT_GAS_PRICE,
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
