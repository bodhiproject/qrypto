import { observable } from 'mobx';
import Transaction from './Transaction';

class TransactionStore {
  @observable.shallow public items: Transaction[] = [];
}

export default new TransactionStore();
