import { observable, action } from 'mobx';
import { Wallet } from 'qtumjs-wallet';

import SubAccount from './SubAccount';
import Transaction from './Transaction';
import { ISigner } from '../types';

export default class Account implements ISigner {
  @observable public name: string;
  @observable public privateKeyHash: string;
  @observable public subAccounts: SubAccount[] = [];
  @observable public wallet?: Wallet;

  constructor(name: string, privateKeyHash: string) {
    this.name = name;
    this.privateKeyHash = privateKeyHash;
  }

  @action
  public addSubAccount(account: SubAccount) {
    this.subAccounts.push(account);
  }

  public signTransaction(address: string, transaction: Transaction): Transaction {
    // TODO: implement signing logic
    console.log(address, transaction);
    return null;
  }
}
