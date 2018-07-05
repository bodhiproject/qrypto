import { observable } from 'mobx';

import SubAccount from './SubAccount';

export default class Account {
  @observable public name?: string;
  @observable public mnemonic?: string;
  @observable public subAccounts: SubAccount[] = [];

  constructor(name: string, mnemonic: string) {
    this.name = name;
    this.mnemonic = mnemonic;
  }
}
