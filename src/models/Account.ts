import { observable, action } from 'mobx';

import SubAccount from './SubAccount';
import Wallet from './Wallet';

export default class Account {
  @observable public name: string;
  @observable public privateKeyHash: string;
  @observable public subAccounts: SubAccount[] = [];
  public wallet?: Wallet;

  constructor(name: string, privateKeyHash: string, subAccounts: SubAccount[] = []) {
    this.name = name;
    this.privateKeyHash = privateKeyHash;
    this.subAccounts = subAccounts;
  }

  @action
  public addSubAccount(account: SubAccount) {
    this.subAccounts.push(account);
  }
}
