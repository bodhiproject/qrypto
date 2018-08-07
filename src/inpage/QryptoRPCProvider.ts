import { isEmpty } from 'lodash';

import { IRPCCallRequest, IRPCCallRequestPayload, IExtensionAPIMessage, IExtensionMessageData, IRPCCallResponsePayload } from '../types';
import { TARGET_NAME, API_TYPE } from '../constants';
import Config from '../config';
import { generateRequestId } from '../utils';

const { DEFAULT_AMOUNT, DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } = Config.TRANSACTION;

export class QryptoRPCProvider {
  private requests: { [id: string]: IRPCCallRequest } = {};

  public rawCall = (method: string, args: any[]) => {
    return new Promise((resolve, reject) => {
      const id = this.trackRequest(resolve, reject);
      this.postMessageToContentscript({
        type: API_TYPE.RPC_REQUEST,
        payload: { method, args, id },
      });
    });
  }

  public sendToContract = (
    contractAddress: string,
    data: string,
    amount = DEFAULT_AMOUNT,
    gasLimit = DEFAULT_GAS_LIMIT,
    gasPrice = DEFAULT_GAS_PRICE,
  ) => {
    if (isEmpty(contractAddress)) {
      throw Error('contractAddress cannot be empty');
    }
    if (isEmpty(data)) {
      throw Error('data cannot be empty');
    }

    return new Promise((resolve, reject) => {
      const id = this.trackRequest(resolve, reject);
      const args = [contractAddress, data, amount, gasLimit, gasPrice];
      this.postMessageToContentscript({
        type: API_TYPE.RPC_SEND_TO_CONTRACT,
        payload: { method: 'sendToContract', args, id },
      });
    });
  }

  public callContract = (contractAddress: string, data: string) => {
    if (isEmpty(contractAddress)) {
      throw Error('contractAddress cannot be empty');
    }
    if (isEmpty(data)) {
      throw Error('data cannot be empty');
    }

    return new Promise((resolve, reject) => {
      const id = this.trackRequest(resolve, reject);
      const args = [contractAddress, data, DEFAULT_AMOUNT, DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE];
      this.postMessageToContentscript({
        type: API_TYPE.RPC_CALL_CONTRACT,
        payload: { method: 'callContract', args, id },
      });
    });
  }

  public handleRpcCallResponse = (response: IRPCCallResponsePayload) => {
    const request = this.requests[response.id];
    if (!request) {
      return;
    }

    delete this.requests[response.id];

    if (response.error) {
      return request.reject(response.error);
    }

    request.resolve(response.result);
  }

  private trackRequest = (resolve: any, reject: any): string => {
    const id = generateRequestId();
    this.requests[id] = { resolve, reject };
    return id;
  }

  private postMessageToContentscript = (message: IExtensionAPIMessage<IRPCCallRequestPayload>) => {
    const messagePayload: IExtensionMessageData<typeof message> = {
      target: TARGET_NAME.CONTENTSCRIPT,
      message,
    };
    window.postMessage(messagePayload, '*');
  }
}
