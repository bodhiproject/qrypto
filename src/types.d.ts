import { utils } from 'ethers';
import { Insight } from 'qtumjs-wallet';
import { ISendTxOptions } from 'qtumjs-wallet/lib/tx';

import { API_TYPE, TARGET_NAME, INTERNAL_API_TYPE, QRYPTO_ACCOUNT_CHANGE } from './constants';
import { Transaction, InpageAccount } from './models';

export interface IExtensionMessageData<T> {
  target: TARGET_NAME;
  message: T;
}

export interface IExtensionAPIMessage<T> {
  type: API_TYPE;
  payload: T;
}

export interface IRPCCallPendingRequest {
  resolve: (result?: any) => void;
  reject: (reason?: any) => void;
}

export interface IRPCCallRequest {
  id: string;
  method: string;
  args: any[];
  account?: ICurrentAccount;
}

export interface IRPCCallResponse {
  id: string;
  result?: Insight.IContractCall | Insight.ISendRawTxResult;
  error?: string;
}

export interface ICurrentAccount {
  name: string;
  address: string;
}

export interface ISignExternalTxRequest {
  url: string;
  request: IRPCCallRequest;
}

export interface ISigner {
  send(to: string, amount: number, options: ISendTxOptions): Promise<Insight.ISendRawTxResult>;
  sendTransaction(args: any[]): any;
}

export interface IInpageAccountWrapper {
  account: InpageAccount;
  error: Error;
  statusChangeReason: QRYPTO_ACCOUNT_CHANGE;
}
