import { observable } from 'mobx';

import Permission from './Permission';

export default class SubAccount {
  @observable public name?: string;
  @observable public permissions: Permission[] = [];

  constructor(name: string, permissions: Permission[]) {
    this.name = name;
    this.permissions = permissions;
  }
}
