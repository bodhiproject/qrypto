import { observable, action } from 'mobx';
import { findIndex } from 'lodash';
import { Wallet } from 'qtumjs-wallet';

import Permission from './Permission';
import Transaction from './Transaction';
import { ISigner } from '../types';

export default class SubAccount implements ISigner {
  @observable public name: string;
  @observable public permissions: Permission[] = [];
  @observable public wallet?: Wallet;

  constructor(name: string, permissions: Permission[]) {
    this.name = name;
    this.permissions = permissions;
  }

  @action
  public changePermission(permissionName: string, allowed: boolean) {
    const permission = new Permission(permissionName, allowed);
    const index = findIndex(this.permissions, { name: permissionName });
    if (index !== -1) {
      this.permissions[index] = permission;
    } else {
      this.permissions.push(permission);
    }
  }

  public signTransaction(address: string, transaction: Transaction): Transaction {
    // TODO: implement signing logic
    console.log(address, transaction);
    return null;
  }
}
