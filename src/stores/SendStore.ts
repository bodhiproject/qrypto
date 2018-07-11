import { observable, computed, action, runInAction, when } from 'mobx';

import AppStore from './AppStore';
import { isValidAddress, isValidAmount } from '../utils';
import { SEND_STATE } from '../constants';

const INIT_VALUES = {
  senderAddress: '',
  receiverAddress: '',
  token: 'QTUM',
  amount: 0,
  sendState: SEND_STATE.INITIAL,
  errorMessage: undefined,
};

export default class SendStore {
  @observable public senderAddress: string = INIT_VALUES.senderAddress;
  @observable public receiverAddress: string = INIT_VALUES.receiverAddress;
  @observable public token: string = INIT_VALUES.token;
  @observable public amount: number = INIT_VALUES.amount;
  @observable public sendState: string = INIT_VALUES.sendState;
  @observable public errorMessage?: string = INIT_VALUES.errorMessage;

  @computed public get receiverFieldError(): string | undefined {
    const isTestnet = true; // TODO: set validation based on network var
    return isValidAddress(this.receiverAddress, isTestnet) ? undefined : 'Not a valid Qtum address';
  }

  @computed public get amountFieldError(): string | undefined {
    return this.app.walletStore.info && isValidAmount(Number(this.amount), this.app.walletStore.info.balance)
      ? undefined : 'Not a valid amount';
  }

  @computed public get buttonDisabled(): boolean {
    return !this.senderAddress || !!this.receiverFieldError || !this.token || !!this.amountFieldError;
  }

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;

    when(
      () => this.sendState === SEND_STATE.SENT,
      () => {
        this.sendState = SEND_STATE.INITIAL;
        this.app.routerStore.push('/home');
        this.app.routerStore.push('/account-detail');
      },
    );
  }

  @action
  public routeToSendConfirm = () => {
    this.app.routerStore.push('/send-confirm');
  }

  @action
  public send = async () => {
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
