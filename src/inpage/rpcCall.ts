import { API_TYPE } from '../constants';
import { processingRPCCallRequests, requestExtensionAPI } from './utils';
import { IRPCCallRequestPayload } from '../types';

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
