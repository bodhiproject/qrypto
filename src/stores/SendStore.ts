import { observable, computed, action } from 'mobx';

import AppStore from './AppStore';
import { SEND_STATE, MESSAGE_TYPE } from '../constants';
import { isValidAddress, isValidAmount } from '../utils';

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
  @observable public sendState: SEND_STATE = INIT_VALUES.sendState;
  @observable public errorMessage?: string = INIT_VALUES.errorMessage;
  @computed public get receiverFieldError(): string | undefined {
    return isValidAddress(this.receiverAddress, !this.isMainNet) ? undefined : 'Not a valid Qtum address';
  }
  @computed public get amountFieldError(): string | undefined {
    const { info } = this.app.sessionStore;
    return info && isValidAmount(Number(this.amount), info.balance) ? undefined : 'Not a valid amount';
  }
  @computed public get buttonDisabled(): boolean {
    return !this.senderAddress || !!this.receiverFieldError || !this.token || !!this.amountFieldError;
  }

  private app: AppStore;
  private isMainNet: boolean = false;

  constructor(app: AppStore) {
    this.app = app;
  }

  @action
  public init = () => {
    chrome.runtime.onMessage.addListener(this.handleMessage);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.IS_MAINNET }, (response: any) => this.isMainNet = response);
  }

  @action
  public routeToSendConfirm = () => {
    this.app.routerStore.push('/send-confirm');
  }

  @action
  public send = () => {
    this.sendState = SEND_STATE.SENDING;
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPE.SEND_TOKENS,
      receiverAddress: this.receiverAddress,
      amount: this.amount,
    });
  }

  @action
  private handleMessage = (request: any) => {
    switch (request.type) {
      case MESSAGE_TYPE.SEND_TOKENS_SUCCESS:
        this.app.routerStore.push('/home'); // so pressing back won't go back to sendConfirm page
        this.app.routerStore.push('/account-detail');
        this.sendState = SEND_STATE.INITIAL;
        break;
      case MESSAGE_TYPE.SEND_TOKENS_FAILURE:
        this.sendState = SEND_STATE.INITIAL;
        this.errorMessage = request.error.message;
        break;
      default:
        break;
    }
  }
}
