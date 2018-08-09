import { IRPCCallPendingRequest, IRPCCallRequest, IExtensionAPIMessage, IExtensionMessageData, IRPCCallResponse } from '../types';
import { TARGET_NAME, API_TYPE } from '../constants';
import { generateRequestId } from '../utils';
import { postWindowMessage } from '../utils/messenger';

export class QryptoRPCProvider {
  private requests: { [id: string]: IRPCCallPendingRequest } = {};

  public rawCall = (method: string, args: any[]) => {
    return new Promise((resolve, reject) => {
      const id = this.trackRequest(resolve, reject);
      postWindowMessage<IRPCCallRequest>(TARGET_NAME.CONTENTSCRIPT, {
        type: API_TYPE.RPC_RESONSE,
        payload: { id, method, args },
      });
    });
  }

  // TODO: move to qweb3
  // public sendToContract = (
  //   contractAddress: string,
  //   data: string,
  //   amount = DEFAULT_AMOUNT,
  //   gasLimit = DEFAULT_GAS_LIMIT,
  //   gasPrice = DEFAULT_GAS_PRICE,
  // ) => {
  //   if (isEmpty(contractAddress)) {
  //     throw Error('contractAddress cannot be empty');
  //   }
  //   if (isEmpty(data)) {
  //     throw Error('data cannot be empty');
  //   }

  //   return new Promise((resolve, reject) => {
  //     const id = this.trackRequest(resolve, reject);
  //     const args = [contractAddress, data, amount, gasLimit, gasPrice];
  //     this.postMessageToContentscript({
  //       type: API_TYPE.RPC_SEND_TO_CONTRACT,
  //       payload: { method: 'sendToContract', args, id },
  //     });
  //   });
  // }

  // TODO: move to qweb3
  // public callContract = (contractAddress: string, data: string) => {
  //   if (isEmpty(contractAddress)) {
  //     throw Error('contractAddress cannot be empty');
  //   }
  //   if (isEmpty(data)) {
  //     throw Error('data cannot be empty');
  //   }

  //   return new Promise((resolve, reject) => {
  //     const id = this.trackRequest(resolve, reject);
  //     const args = [contractAddress, data, DEFAULT_AMOUNT, DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE];
  //     this.postMessageToContentscript({
  //       type: API_TYPE.RPC_CALL_CONTRACT,
  //       payload: { method: 'callContract', args, id },
  //     });
  //   });
  // }

  public handleRpcCallResponse = (response: IRPCCallResponse) => {
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
}
