import { observable, action, runInAction } from 'mobx';

import AppStore from './AppStore';

export const SEND_STATE = {
  INITIAL: 'Confirm',
  SENDING: 'Sending...',
  SENT: 'Sent!',
};
const INIT_VALUES = {
  senderAddress: '',
  receiverAddress: '',
  token: 'QTUM',
  amount: 0,
  sendState: SEND_STATE.INITIAL,
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
  public routeToSendConfirm = () => {
    this.app.routerStore.push('/send-confirm');
  }

  @action
  public async send() {
    try {
      this.sendState = SEND_STATE.SENDING;
      await this.app.walletStore.wallet!.send(this.receiverAddress, this.amount * 1e8, {
        feeRate: 4000,
      });

      runInAction(() => this.sendState = SEND_STATE.SENT);
    } catch (err) {
      console.log(err);
      runInAction(() => {
        this.sendState = SEND_STATE.INITIAL;
        this.errorMessage = err.message;
      });
    }
  }
}
