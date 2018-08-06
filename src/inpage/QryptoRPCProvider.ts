import { IRPCCallRequest, IRPCCallRequestPayload, IExtensionAPIMessage, IExtensionMessageData, IRPCCallResponsePayload } from '../types';
import { TARGET_NAME, API_TYPE } from '../constants';

export class QryptoRPCProvider {
  private static generateRequestId = () => {
    return Math.random().toString().slice(-8);
  }

  private requests: { [id: string]: IRPCCallRequest } = {};

  public rawCall = (method: string, args: any[]) => {
    return new Promise((resolve, reject) => {
      const id = QryptoRPCProvider.generateRequestId();
      this.requests[id] = { resolve, reject };

      this.postMessageToContentscript({
        type: API_TYPE.RPC_REQUEST,
        payload: { method, args, id },
      });
    });
  }

  public sendToContract = (method: string, args: any[]) => {
    return new Promise((resolve, reject) => {
      const id = QryptoRPCProvider.generateRequestId();
      this.requests[id] = { resolve, reject };

      this.postMessageToContentscript({
        type: API_TYPE.RPC_SEND_TO_CONTRACT,
        payload: { method, args, id },
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

  private postMessageToContentscript = (message: IExtensionAPIMessage<IRPCCallRequestPayload>) => {
    const messagePayload: IExtensionMessageData<typeof message> = {
      target: TARGET_NAME.CONTENTSCRIPT,
      message,
    };
    window.postMessage(messagePayload, '*');
  }
}
