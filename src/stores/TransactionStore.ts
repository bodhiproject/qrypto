import { observable, action } from 'mobx';
import Transaction from './models/Transaction';

class TransactionStore {
  @observable.shallow public items: Transaction[] = [];

  @action public loadFromIDs(items: string[]) {
    this.items = items.map((id) => new Transaction({ id }));
  }
}

export default new TransactionStore();
