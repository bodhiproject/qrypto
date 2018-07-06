import { observable, action } from 'mobx';

import Transaction from '../models/Transaction';

export default class AccountDetailStore {
  @observable public activeTabIdx: number = 0;
  @observable.shallow public items: Transaction[] = [];

  @action
  public loadFromIds(items: string[]) {
    // TODO: Get transaction informations (The qtum-walletjs not yet implemented)
    this.items = items.map((id) => new Transaction({ id }));
  }
}
