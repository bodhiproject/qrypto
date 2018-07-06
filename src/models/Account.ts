import { observable, action } from 'mobx';

import SubAccount from './SubAccount';

export default class Account {
  @observable public name: string;
  @observable public mnemonic: string;
  @observable public subAccounts: SubAccount[] = [];

  constructor(name: string, mnemonic: string) {
    this.name = name;
    this.mnemonic = mnemonic;
  }

  @action
  public addSubAccount(account: SubAccount) {
    this.subAccounts.push(account);
  }
}
