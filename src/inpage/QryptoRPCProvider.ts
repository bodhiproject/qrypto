import { rpcCall } from './rpcCall';

export class QryptoRPCProvider {
  public rawCall(method: string, args: any[]) {
    return rpcCall(method, args);
  }
}
