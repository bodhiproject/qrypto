import { API_TYPE } from '../constants';
import { requestExtensionAPI } from './utils';
import { IRPCCallResponsePayload, IRPCCallRequestPayload } from '../types';

const processingRPCCallRequests: { [id: string]: IRPCCallRequest } = {};

export function rpcCall(method: string, args: any[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString().slice(-8);
    processingRPCCallRequests[id] = { resolve, reject };

    requestExtensionAPI<IRPCCallRequestPayload>({
      type: API_TYPE.RPC_REQUEST,
      payload: { method, args, id },
    });
  });
}

export function handleRPCCallResponse(response: IRPCCallResponsePayload) {
  const request = processingRPCCallRequests[response.id];
  if (!request) {
    return;
  }

  delete processingRPCCallRequests[response.id];

  if (response.error != null) {
    request.reject(response.error);

    return;
  }
  console.log('call rpc method success!');
  request.resolve(response.result);
}

interface IRPCCallRequest {
  resolve: (result?: any) => void;
  reject: (reason?: any) => void;
}
