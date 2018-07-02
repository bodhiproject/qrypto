import { observable, computed } from 'mobx';

export default class Transaction {
  @observable public id?: string;
  @observable public timestamp?: string;
  @observable public confirmations: number = 0;
  @observable public amount: number = 0;

  constructor(attributes = {}) {
    Object.assign(this, attributes);
  }

  @computed get pending() {
    return !this.confirmations;
  }
}
