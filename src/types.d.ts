import { utils } from 'ethers';
import { Insight } from 'qtumjs-wallet';

import { API_TYPE, TARGET_NAME, INTERNAL_API_TYPE } from './constants';
import Transaction from './models/Transaction';

export interface IExtensionMessageData<T> {
  target: TARGET_NAME;
  message: T;
}

export interface IExtensionAPIMessage<T> {
  type: API_TYPE;
  payload: T;
}

export interface ISendQtumRequestPayload {
  id: string;
  address: string;
  amount: number;
}

export interface ISendQtumResponsePayload {
  id: string;
  result?: Insight.ISendRawTxResult;
  error?: string;
}

export interface IRPCCallRequestPayload {
  id: string;
  method: string;
  args: any[];
}

export interface IRPCCallResponsePayload {
  id: string;
  result?: Insight.IContractCall | Insight.ISendRawTxResult;
  error?: string;
}

export interface ISigner {
  signTransaction(address: string, transaction: Transaction): Transaction;
  // signMessage(address: string, message: Transaction): Transaction;
}
