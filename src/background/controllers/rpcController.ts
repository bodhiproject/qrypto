import { WalletRPCProvider, Insight } from 'qtumjs-wallet';

import QryptoController from '.';
import IController from './iController';
import { MESSAGE_TYPE, RPC_METHOD } from '../../constants';
import { IRPCCallResponse } from '../../types';
import Config from '../../config';

export default class RPCController extends IController {
  constructor(main: QryptoController) {
    super('rpc', main);

    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.initFinished();
  }

  /*
  * Executes a sendtocontract on the blockchain.
  * @param contractAddress The contract address of the contract.
  * @param abi The ABI of the contract.
  * @param methodName The method to call that is in the ABI.
  * @param args The arguments that are needed when calling the method.
  *   @argParam gasLimit (unit - gas)
  *   @argParam gasPrice (unit - satoshi/gas)
  * @return The result of the callcontract.
  */
  public sendToContract = async (id: string, args: any[]): Promise<IRPCCallResponse> => {
    let result: any;
    let error: string | undefined;
    try {
      const rpcProvider = this.rpcProvider();
      if (!rpcProvider) {
        throw Error('Cannot sendtocontract without RPC provider.');
      }
      if (args.length < 2) {
        throw Error('Requires first two arguments: contractAddress and data.');
      }

      // Set default values for amount, gasLimit, and gasPrice if needed
      const { DEFAULT_AMOUNT, DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } = Config.TRANSACTION;
      const [address, data, amount, gasLimit, gasPrice] = args;
      const newArgs = [
        address,
        data,
        amount || DEFAULT_AMOUNT,
        gasLimit || DEFAULT_GAS_LIMIT,
        gasPrice * 1e-8 || DEFAULT_GAS_PRICE,
      ];
      result = await this.main.account.loggedInAccount!.wallet!.sendTransaction(newArgs) as Insight.ISendRawTxResult;
    } catch (err) {
      error = err.message;
      console.error(error);
    }

    return { id, result, error };
  }

  /*
  * Executes a callcontract request.
  * @param id Request ID.
  * @param args Request arguments. [contractAddress, data, amount?, gasLimit?, gasPrice?]
  */
  public callContract = async (id: string, args: any[]): Promise<IRPCCallResponse> => {
    let result: any;
    let error: string | undefined;
    try {
      const rpcProvider = this.rpcProvider();
      if (!rpcProvider) {
        throw Error('Cannot callcontract without RPC provider.');
      }
      if (args.length < 2) {
        throw Error('Requires first two arguments: contractAddress and data.');
      }

      result = await rpcProvider.rawCall(RPC_METHOD.CALL_CONTRACT, args) as Insight.IContractCall;
    } catch (err) {
      error = err.message;
      console.error(error);
    }

    return { id, result, error };
  }

  /*
  * Gets the current logged in RPC provider.
  * @return Logged in account's RPC provider.
  */
  private rpcProvider = (): WalletRPCProvider | undefined => {
    const acct = this.main.account.loggedInAccount;
    return acct && acct.wallet && acct.wallet.rpcProvider;
  }

  /*
  * Sends the RPC response or error to the active tab that requested.
  * @param id Request ID.
  * @param result RPC call result.
  * @param error RPC call error.
  */
  private sendRpcResponseToActiveTab = (id: string, result: any, error?: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([{ id: tabID }]) => {
      chrome.tabs.sendMessage(tabID!, { type: MESSAGE_TYPE.EXTERNAL_RPC_CALL_RETURN, id, result, error });
    });
  }

  /*
  * Handles a rawCall requested externally and sends the response back to the active tab.
  * @param id Request ID.
  * @param args Request arguments. [contractAddress, data, amount?, gasLimit?, gasPrice?]
  */
  private externalRawCall = async (id: string, method: string, args: any[]) => {
    let result: any;
    let error: string | undefined;

    try {
      const rpcProvider = this.rpcProvider();
      if (!rpcProvider) {
        throw Error('Cannot call RPC without provider.');
      }

      result = await rpcProvider.rawCall(method, args);
    } catch (e) {
      error = e.message;
    }

    this.sendRpcResponseToActiveTab(id, result, error);
  }

  /*
  * Handles a sendToContract requested externally and sends the response back to the active tab.
  * @param id Request ID.
  * @param args Request arguments. [contractAddress, data, amount?, gasLimit?, gasPrice?]
  */
  private externalSendToContract = async (id: string, args: any[]) => {
    if (!this.rpcProvider()) {
      throw Error('Cannot call RPC without provider.');
    }

    const { result, error } = await this.sendToContract(id, args);
    this.sendRpcResponseToActiveTab(id, result, error);
  }

  /*
  * Handles a callContract requested externally and sends the response back to the active tab.
  * @param id Request ID.
  * @param args Request arguments. [contractAddress, data, amount?, gasLimit?, gasPrice?]
  */
  private externalCallContract = async (id: string, args: any[]) => {
    if (!this.rpcProvider()) {
      throw Error('Cannot call RPC without provider.');
    }

    const { result, error } = await this.callContract(id, args);
    this.sendRpcResponseToActiveTab(id, result, error);
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender) => {
    switch (request.type) {
      case MESSAGE_TYPE.EXTERNAL_RAW_CALL:
        this.externalRawCall(request.id, request.method, request.args);
        break;
      case MESSAGE_TYPE.EXTERNAL_SEND_TO_CONTRACT:
        this.externalSendToContract(request.id, request.args);
        break;
      case MESSAGE_TYPE.EXTERNAL_CALL_CONTRACT:
        this.externalCallContract(request.id, request.args);
        break;
      default:
        break;
    }
  }
}
