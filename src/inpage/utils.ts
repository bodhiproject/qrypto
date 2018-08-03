import { IExtensionAPIMessage, IExtensionMessageData, IRPCCallResponsePayload } from '../types';
import { TARGET_NAME } from '../constants';

export const processingRPCCallRequests: { [id: string]: IRPCCallRequest } = {};

export function requestExtensionAPI<T>(message: IExtensionAPIMessage<T>) {
  const messagePayload: IExtensionMessageData<typeof message> = {
    target: TARGET_NAME.CONTENTSCRIPT,
    message,
  };

  window.postMessage(messagePayload, '*');
}

export function handleRpcCallResponse(response: IRPCCallResponsePayload) {
  const request = processingRPCCallRequests[response.id];
  if (!request) {
    return;
  }

  delete processingRPCCallRequests[response.id];

  if (response.error) {
    return request.reject(response.error);
  }

  request.resolve(response.result);
}

interface IRPCCallRequest {
  resolve: (result?: any) => void;
  reject: (reason?: any) => void;
}
