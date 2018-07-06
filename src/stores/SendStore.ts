import { observable, action, runInAction } from 'mobx';

import AppStore from './AppStore';

const INIT_VALUES = {
  senderAddress: '',
  receiverAddress: '',
  token: 'QTUM',
  amount: 0,
  tip: '',
};

export default class SendStore {
  @observable public senderAddress: string = INIT_VALUES.senderAddress;
  @observable public receiverAddress: string = INIT_VALUES.receiverAddress;
  @observable public token: string = INIT_VALUES.token;
  @observable public amount: number = INIT_VALUES.amount;
  @observable public tip: string = INIT_VALUES.tip;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
  }

  @action
  public async send() {
    try {
      this.tip = 'Sending...';
      await this.app.walletStore.wallet!.send(this.receiverAddress, this.amount * 1e8, {
        feeRate: 4000,
      });

      runInAction(() => this.tip = 'Sent!');
    } catch (err) {
      console.log(err);
      runInAction(() => this.tip = err.message);
    }
  }
}
