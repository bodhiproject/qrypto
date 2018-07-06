import { observable } from 'mobx';

export default class Permission {
  @observable public name: string;
  @observable public allowed: boolean = false;

  constructor(name: string, allowed: boolean) {
    this.name = name;
    this.allowed = allowed;
  }
}
