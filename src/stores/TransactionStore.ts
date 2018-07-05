import { observable, action } from 'mobx';
import Transaction from '../models/Transaction';

class TransactionStore {
  @observable.shallow public items: Transaction[] = [];

  @action public loadFromIds(items: string[]) {
    // TODO: Get transaction informations (The qtum-walletjs not yet implemented)
    this.items = items.map((id) => new Transaction({ id }));
  }
}

export default new TransactionStore();
