import { observable, computed, action, reaction } from 'mobx';
import { find } from 'lodash';

import AppStore from './AppStore';
import { SEND_STATE, MESSAGE_TYPE } from '../../constants';
import { isValidAddress, isValidAmount } from '../../utils';
import QRCToken from '../../models/QRCToken';

const INIT_VALUES = {
  tokens: [],
  senderAddress: undefined,
  receiverAddress: undefined,
  token: undefined,
  amount: 0,
  maxAmount: undefined,
  sendState: SEND_STATE.INITIAL,
  errorMessage: undefined,
};

export default class SendStore {
  @observable public tokens: QRCToken[] = INIT_VALUES.tokens;
  @observable public senderAddress?: string = INIT_VALUES.senderAddress;
  @observable public receiverAddress?: string = INIT_VALUES.receiverAddress;
  @observable public token?: string = INIT_VALUES.token;
  @observable public amount: number = INIT_VALUES.amount;
  @observable public maxAmount?: number = INIT_VALUES.maxAmount;
  @observable public sendState: SEND_STATE = INIT_VALUES.sendState;
  @observable public errorMessage?: string = INIT_VALUES.errorMessage;
  @computed public get receiverFieldError(): string | undefined {
    return isValidAddress(!this.isMainNet, this.receiverAddress) ? undefined : 'Not a valid Qtum address';
  }
  @computed public get amountFieldError(): string | undefined {
    return this.maxAmount && isValidAmount(Number(this.amount), this.maxAmount) ? undefined : 'Not a valid amount';
  }
  @computed public get buttonDisabled(): boolean {
    return !this.senderAddress || !!this.receiverFieldError || !this.token || !!this.amountFieldError;
  }

  private app: AppStore;
  private isMainNet: boolean = false;

  constructor(app: AppStore) {
    this.app = app;

    reaction(
      () => this.token,
      () => this.setMaxAmount(),
    );
  }

  @action
  public init = () => {
    chrome.runtime.onMessage.addListener(this.handleMessage);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.IS_MAINNET }, (response: any) => this.isMainNet = response);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_QRC_TOKEN_LIST }, (response: any) => {
      this.tokens = response;
      this.tokens.unshift(new QRCToken('Qtum Token', 'QTUM', 8, ''));
      this.tokens[0].balance = this.app.sessionStore.info ? this.app.sessionStore.info!.balance : undefined;
      this.token = this.tokens[0].abbreviation;
      this.setMaxAmount();
    });
    this.senderAddress = this.app.sessionStore.info ? this.app.sessionStore.info!.addrStr : undefined;
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
  private setMaxAmount = () => {
    const qrc = find(this.tokens, { abbreviation: this.token });
    this.maxAmount = qrc ? qrc.balance : undefined;
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
