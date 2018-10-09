import { IRPCCallPendingRequest, IRPCCallRequest, IRPCCallResponse } from '../types';
import { TARGET_NAME, API_TYPE } from '../constants';
import { generateRequestId } from '../utils';
import { postWindowMessage } from '../utils/messenger';

export class QryptoRPCProvider {
  private requests: { [id: string]: IRPCCallPendingRequest } = {};

  public rawCall = (method: string, args: any[]) => {
    return new Promise((resolve, reject) => {
      const id = this.trackRequest(resolve, reject);
      postWindowMessage<IRPCCallRequest>(TARGET_NAME.CONTENTSCRIPT, {
        type: API_TYPE.RPC_REQUEST,
        payload: { id, method, args },
      });
    });
  }

  /**
   * @param response.error {string}
   * We receive the response.error as a string, so we convert it back to an error object
   * before we reject the promise so that rawCall can handle it as an error object.
   * We are unable to pass the original error object all the way to this function
   * because chrome.tabs.sendMessage and window.postMessage do not support passing the
   * error object type.
   */
  public handleRpcCallResponse = (response: IRPCCallResponse) => {
    const request = this.requests[response.id];
    if (!request) {
      return;
    }

    delete this.requests[response.id];

    if (response.error) {
      return request.reject(Error(response.error));
    }

    request.resolve(response.result);
  }

  private trackRequest = (resolve: any, reject: any): string => {
    const id = generateRequestId();
    this.requests[id] = { resolve, reject };
    return id;
  }
}
