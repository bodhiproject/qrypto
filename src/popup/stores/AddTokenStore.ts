import { observable, computed, action, reaction } from 'mobx';
import { findIndex } from 'lodash';
const extension = require('extensionizer');

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
  @observable public contractAddress?: string = INIT_VALUES.contractAddress;
  @observable public name?: string = INIT_VALUES.name;
  @observable public symbol?: string = INIT_VALUES.symbol;
  @observable public decimals?: number = INIT_VALUES.decimals;
  @observable public getQRCTokenDetailsFailed?: boolean = INIT_VALUES.getQRCTokenDetailsFailed;
  @computed public get contractAddressFieldError(): string | undefined {
    return (!!this.contractAddress
      && isValidContractAddressLength(this.contractAddress)
      && !this.getQRCTokenDetailsFailed)
      ? undefined : 'Not a valid contract address';
  }
  @computed public get buttonDisabled(): boolean {
    return !this.contractAddress
      || !this.name
      || !this.symbol
      || !this.decimals
      || !!this.contractAddressFieldError
      || !!this.tokenAlreadyInListError;
  }
  @computed public get tokenAlreadyInListError(): string | undefined {
    // Check if the token is already in the list
    const index = findIndex(this.app.accountDetailStore.tokens, { address: this.contractAddress });
    return (index !== -1 ? 'Token already in token list' : undefined );
  }

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
    this.setInitValues();

    reaction(
      () => this.contractAddress,
      () => {
        this.resetTokenDetails();
        // If valid contract address, send rpc call to fetch other contract details
        if (this.contractAddress && !this.contractAddressFieldError) {
          extension.runtime.sendMessage(
            { type: MESSAGE_TYPE.GET_QRC_TOKEN_DETAILS,
              contractAddress: this.contractAddress});
        }
      },
    );
  }

  public addToken = () => {
    extension.runtime.sendMessage({
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
    extension.runtime.onMessage.addListener(this.handleMessage);
  }

  @action
  private setInitValues = () => {
    this.contractAddress = INIT_VALUES.contractAddress;
    this.resetTokenDetails();
  }

  @action
  private resetTokenDetails = () => {
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
          const { name, symbol, decimals } = request.token;
          this.name = name;
          this.symbol = symbol;
          this.decimals = decimals;
        } else {
          this.getQRCTokenDetailsFailed = true;
        }
        break;
      default:
        break;
    }
  }
}
