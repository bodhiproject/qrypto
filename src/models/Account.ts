import SubAccount from './SubAccount';

export default class Account {
  private _name: string;
  private _mnemonic: string;
  private _subAccounts: SubAccount[] = [];

  constructor(name: string, mnemonic: string) {
    this._name = name;
    this._mnemonic = mnemonic;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get mnemonic(): string {
    return this._mnemonic;
  }

  set mnemonic(mnemonic: string) {
    this._mnemonic = mnemonic;
  }

  get subAccounts(): SubAccount[] {
    return this._subAccounts;
  }

  set addSubAccount(account: SubAccount) {
    this._subAccounts.push(account);
  }
}
