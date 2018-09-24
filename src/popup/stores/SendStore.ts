import { observable, computed, action, reaction } from 'mobx';
import { find } from 'lodash';

import AppStore from './AppStore';
import { SEND_STATE, MESSAGE_TYPE, TRANSACTION_SPEED } from '../../constants';
import { isValidAddress, isValidAmount, isValidGasLimit, isValidGasPrice } from '../../utils';
import QRCToken from '../../models/QRCToken';
import Config from '../../config';

const INIT_VALUES = {
  tokens: [],
  senderAddress: undefined,
  receiverAddress: '',
  token: undefined,
  amount: '',
  maxAmount: undefined,
  sendState: SEND_STATE.INITIAL,
  errorMessage: undefined,
  transactionSpeed: TRANSACTION_SPEED.NORMAL,
  transactionSpeeds: [TRANSACTION_SPEED.SLOW, TRANSACTION_SPEED.NORMAL, TRANSACTION_SPEED.FAST],
  gasLimit: Config.TRANSACTION.DEFAULT_GAS_LIMIT.toString(),
  gasPrice: (Config.TRANSACTION.DEFAULT_GAS_PRICE * 1e8).toString(),
  gasLimitRecommendedAmount: Config.TRANSACTION.DEFAULT_GAS_LIMIT.toString(),
  gasPriceRecommendedAmount: (Config.TRANSACTION.DEFAULT_GAS_PRICE * 1e8).toString(), // satoshi/gas
};

export default class SendStore {
  @observable public tokens: QRCToken[] = INIT_VALUES.tokens;
  @observable public senderAddress?: string = INIT_VALUES.senderAddress;
  @observable public receiverAddress?: string = INIT_VALUES.receiverAddress;
  @observable public token?: QRCToken = INIT_VALUES.token;
  @observable public amount: string = INIT_VALUES.amount;
  @observable public maxAmount?: number = INIT_VALUES.maxAmount;
  public transactionSpeeds: string[] = INIT_VALUES.transactionSpeeds;
  @observable public transactionSpeed?: string = INIT_VALUES.transactionSpeed;
  @observable public gasLimit: string = INIT_VALUES.gasLimitRecommendedAmount;
  @observable public gasPrice: string = INIT_VALUES.gasPriceRecommendedAmount;
  public gasLimitRecommendedAmount: string = INIT_VALUES.gasLimitRecommendedAmount;
  public gasPriceRecommendedAmount: string = INIT_VALUES.gasPriceRecommendedAmount;
  @observable public sendState: SEND_STATE = INIT_VALUES.sendState;
  @observable public errorMessage?: string = INIT_VALUES.errorMessage;
  @computed public get maxTxFee(): number | undefined {
    return this.gasPrice && this.gasLimit
      ? Number(this.gasLimit) * Number(this.gasPrice) * 1e-8 : undefined;
  }
  @computed public get receiverFieldError(): string | undefined {
    return isValidAddress(this.isMainNet, this.receiverAddress)
      ? undefined : 'Not a valid Qtum address';
  }
  @computed public get amountFieldError(): string | undefined {
    return this.maxAmount && isValidAmount(Number(this.amount), this.maxAmount) ? undefined : 'Not a valid amount';
  }
  @computed public get gasLimitFieldError(): string | undefined {
    return isValidGasLimit(Number(this.gasLimit)) ? undefined : 'Not a valid gas limit';
  }
  @computed public get gasPriceFieldError(): string | undefined {
    return isValidGasPrice(Number(this.gasPrice)) ? undefined : 'Not a valid gas price';
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
      () => this.maxAmount = this.token!.balance,
    );
  }

  @action
  public init = () => {
    chrome.runtime.onMessage.addListener(this.handleMessage);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.IS_MAINNET }, (response: any) => this.isMainNet = response);
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_QRC_TOKEN_LIST }, (response: any) => {
      this.tokens = response;
      this.tokens.unshift(new QRCToken('Qtum Token', 'QTUM', 8, ''));
      this.tokens[0].balance = this.app.sessionStore.info ? this.app.sessionStore.info.balance : undefined;
      this.token = this.tokens[0];
      this.maxAmount = this.token!.balance;
    });
    this.senderAddress = this.app.sessionStore.info ? this.app.sessionStore.info.addrStr : undefined;
  }

  @action
  public changeToken = (tokenSymbol: string) => {
    const token = find(this.tokens, { symbol: tokenSymbol });
    if (token) {
      this.token = token;
    }
  }

  @action
  public routeToSendConfirm = () => {
    this.app.routerStore.push('/send-confirm');
  }

  @action
  public send = () => {
    if (!this.token) {
      return;
    }

    this.sendState = SEND_STATE.SENDING;
    if (this.token.symbol === 'QTUM') {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.SEND_TOKENS,
        receiverAddress: this.receiverAddress,
        amount: Number(this.amount),
        transactionSpeed: this.transactionSpeed,
      });
    } else {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.SEND_QRC_TOKENS,
        receiverAddress: this.receiverAddress,
        amount: Number(this.amount),
        token: this.token,
        gasLimit: Number(this.gasLimit),
        gasPrice: Number(this.gasPrice),
      });
    }
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
