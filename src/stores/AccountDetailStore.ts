import { observable } from 'mobx';

class AccountDetailStore {
  @observable public activeTabIdx: number = 0;
}

export default new AccountDetailStore();
