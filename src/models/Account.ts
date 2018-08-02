import { observable, action } from 'mobx';
import { Wallet } from 'qtumjs-wallet';

import SubAccount from './SubAccount';

export default class Account {
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
}
