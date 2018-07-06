import { observable, action, runInAction } from 'mobx';

import AppStore from './AppStore';

const INIT_VALUES = {
  senderAddress: '',
  receiverAddress: '',
  token: 'QTUM',
  amount: 0,
  sendState: 'Initial',
  errorMessage: '',
};

export default class SendStore {
  @observable public senderAddress: string = INIT_VALUES.senderAddress;
  @observable public receiverAddress: string = INIT_VALUES.receiverAddress;
  @observable public token: string = INIT_VALUES.token;
  @observable public amount: number = INIT_VALUES.amount;
  @observable public sendState: string = INIT_VALUES.sendState;
  @observable public errorMessage: string = INIT_VALUES.errorMessage;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
  }

  @action
  public async send() {
    try {
      this.sendState = 'Sending...';
      await this.app.walletStore.wallet!.send(this.receiverAddress, this.amount * 1e8, {
        feeRate: 4000,
      });

      runInAction(() => this.sendState = 'Sent!');
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.sendState = 'Initial';
        this.errorMessage = err.message;
      });
    }
  }
}
