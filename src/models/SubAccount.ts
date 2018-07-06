import { observable, action } from 'mobx';
import { findIndex } from 'lodash';

import Permission from './Permission';

export default class SubAccount {
  @observable public name: string;
  @observable public permissions: Permission[] = [];

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
}
