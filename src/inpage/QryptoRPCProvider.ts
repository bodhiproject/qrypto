import { rpcCall } from './rpcCall';

export class QryptoRpcProvider {
  public rawCall(method: string, args: any[]) {
    return rpcCall(method, args);
  }
}
