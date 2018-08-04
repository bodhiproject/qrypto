import { observable, computed } from 'mobx';

export default class Transaction {
  @observable public id?: string;
  @observable public timestamp?: string;
  @observable public confirmations: number = 0;
  @observable public amount: number = 0;
  @computed public get pending() {
    return !this.confirmations;
  }

  constructor(attributes = {}) {
    Object.assign(this, attributes);
  }
}
