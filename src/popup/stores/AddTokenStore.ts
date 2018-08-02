import { observable, computed, action, reaction } from 'mobx';

import AppStore from './AppStore';
import { MESSAGE_TYPE } from '../../constants';
import { isValidContractAddressLength } from '../../utils';

const INIT_VALUES = {
  contractAddress: '',
  name: '',
  symbol: '',
  decimals: undefined,
  getQRCTokenDetailsFailed: false,
};

export default class AddTokenStore {
  @observable public contractAddress?: string;
  @observable public name?: string;
  @observable public symbol?: string;
  @observable public decimals?: number;
  @observable public getQRCTokenDetailsFailed?: boolean;
  @computed public get contractAddressFieldError(): string | undefined {
    return (isValidContractAddressLength(this.contractAddress) && !this.getQRCTokenDetailsFailed)
    ? undefined : 'Not a valid contract address';
  }
  @computed public get buttonDisabled(): boolean {
    return !this.contractAddress
    || !this.name
    || !this.symbol
    || !this.decimals
    || !!this.contractAddressFieldError;
  }

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
    this.setInitValues();

    reaction(
      () => this.contractAddress,
      () => {
        this.setInitValuesOtherThanContractAddr();
        // If valid contract address, send rpc call to fetch other contract details
        if (this.contractAddress && !this.contractAddressFieldError) {
          chrome.runtime.sendMessage(
            { type: MESSAGE_TYPE.GET_QRC_TOKEN_DETAILS,
              contractAddress: this.contractAddress});
        }
      },
    );
  }

  public addToken = () => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPE.ADD_TOKEN,
      contractAddress: this.contractAddress,
      name: this.name,
      symbol: this.symbol,
      decimals: this.decimals,
    });
    this.app.routerStore.push('/account-detail');
    this.app.accountDetailStore.shouldScrollToBottom = true;
    this.setInitValues();
  }

  @action
  public init = () => {
    chrome.runtime.onMessage.addListener(this.handleMessage);
  }

  @action
  private setInitValues = () => {
    this.contractAddress = INIT_VALUES.contractAddress;
    this.setInitValuesOtherThanContractAddr();
  }

  @action
  private setInitValuesOtherThanContractAddr = () => {
    this.name = INIT_VALUES.name;
    this.symbol = INIT_VALUES.symbol;
    this.decimals = INIT_VALUES.decimals;
    this.getQRCTokenDetailsFailed = INIT_VALUES.getQRCTokenDetailsFailed;
  }

  @action
  private handleMessage = (request: any) => {
    switch (request.type) {
      case MESSAGE_TYPE.QRC_TOKEN_DETAILS_RETURN:
        if (request.isValid) {
          this.name = request.token.name;
          this.symbol = request.token.symbol;
          this.decimals = request.token.decimals;
        } else {
          this.getQRCTokenDetailsFailed = true;
        }
        break;
      default:
        break;
    }
  }
}
