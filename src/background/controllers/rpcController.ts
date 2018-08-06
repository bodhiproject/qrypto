import { WalletRPCProvider, Insight } from 'qtumjs-wallet';
import { find } from 'lodash';
const { Contract, Decoder } = require('qweb3');

import QryptoController from '.';
import IController from './iController';
import { MESSAGE_TYPE } from '../../constants';
import { IRPCRequestPayload } from '../../types';
import Config from '../../config';

export default class RPCController extends IController {
  constructor(main: QryptoController) {
    super('rpc', main);

    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.initFinished();
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
    const rpcProvider = this.rpcProvider();
    if (!rpcProvider) {
      throw Error('Tried to callContract with no RPC provider.');
    }

    const data = this.encodeDataHex(payload.abi, payload.methodName, payload.args);
    const res = await rpcProvider.rawCall('callContract', [
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
    const rpcProvider = this.rpcProvider();
    if (!rpcProvider) {
      throw Error('Tried to sendToContract with no RPC provider.');
    }

    const { DEFAULT_AMOUNT, DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } = Config.TRANSACTION;
    const { contractAddress, abi, methodName, args, amount, gasLimit, gasPrice } = payload;
    const data = this.encodeDataHex(abi, methodName, args);
    const res: Insight.ISendRawTxResult = await rpcProvider.rawCall('sendToContract', [
      contractAddress,
      data,
      amount || DEFAULT_AMOUNT,
      gasLimit || DEFAULT_GAS_LIMIT,
      gasPrice || DEFAULT_GAS_PRICE,
    ]) as Insight.ISendRawTxResult;
    return res;
  }

  /*
  * Gets the current logged in RPC provider.
  * @return Logged in account's RPC provider.
  */
  private rpcProvider = (): WalletRPCProvider | undefined => {
    const acct = this.main.account.loggedInAccount;
    return acct && acct.wallet && acct.wallet.rpcProvider;
  }

  private externalRawCall = async (id: number, method: string, args: any[]) => {
    let result: any;
    let error: string;

    try {
      const rpcProvider = this.rpcProvider();
      if (!rpcProvider) {
        throw Error('Cannot call RPC without provider.');
      }

      result = await rpcProvider.rawCall(method, args);
    } catch (e) {
      error = e.message;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, ([{ id: tabID }]) => {
      chrome.tabs.sendMessage(tabID!, { type: MESSAGE_TYPE.EXTERNAL_RPC_CALL_RETURN, id, result, error });
    });
  }

  /*
  * Handles a sendToContract requested externally and sends the response back to the active tab.
  * @param id Request ID.
  * @param args Request arguments. [contractAddress, data, amount?, gasLimit?, gasPrice?]
  */
  private externalSendToContract = async (id: number, args: any[]) => {
    let result: any;
    let error: string;
    try {
      result = await this.main.account.loggedInAccount!.wallet!.signTransaction(args);
    } catch (err) {
      error = err.message;
      console.error(error);
    }

    chrome.tabs.query({ active: true, currentWindow: true }, ([{ id: tabID }]) => {
      chrome.tabs.sendMessage(tabID!, { type: MESSAGE_TYPE.EXTERNAL_RPC_CALL_RETURN, id, result, error });
    });
  }

  /*
  * Handles a callContract requested externally and sends the response back to the active tab.
  * @param id Request ID.
  * @param args Request arguments. [contractAddress, data, amount?, gasLimit?, gasPrice?]
  */
  private externalCallContract = async (id: number, args: any[]) => {
    let result: any;
    let error: string;
    try {
      const rpcProvider = this.rpcProvider();
      if (!rpcProvider) {
        throw Error('Cannot callContract without wallet.');
      }
      if (args.length < 2) {
        throw Error('Requires first two arguments: contractAddress and data.');
      }

      result = await rpcProvider.rawCall('callContract', args) as Insight.IContractCall;
    } catch (err) {
      error = err.message;
      console.error(error);
    }

    chrome.tabs.query({ active: true, currentWindow: true }, ([{ id: tabID }]) => {
      chrome.tabs.sendMessage(tabID!, { type: MESSAGE_TYPE.EXTERNAL_RPC_CALL_RETURN, id, result, error });
    });
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.EXTERNAL_RAW_CALL:
        if (this.rpcProvider()) {
          this.externalRawCall(request.id, request.method, request.args);
          sendResponse(true);
        } else {
          sendResponse(false);
        }
        break;
      case MESSAGE_TYPE.EXTERNAL_SEND_TO_CONTRACT:
        if (this.rpcProvider()) {
          this.externalSendToContract(request.id, request.args);
          sendResponse(true);
        } else {
          sendResponse(false);
        }
        break;
      case MESSAGE_TYPE.EXTERNAL_CALL_CONTRACT:
        if (this.rpcProvider()) {
          this.externalCallContract(request.id, request.args);
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
