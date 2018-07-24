import { every } from 'lodash';

import WalletBackground from './walletBackground';
import AccountBackground from './accountBackground';
import AccountDetailBackground from './accountDetailBackground';
import NetworkBackground from './networkBackground';
import { MESSAGE_TYPE } from '../constants';

export default class Background {
  public wallet: WalletBackground;
  public account: AccountBackground;
  public network: NetworkBackground;
  public accountDetail: AccountDetailBackground;
  public initFinished: object = {
    wallet: false,
    account: false,
    network: false,
    accountDetail: false,
  };

  constructor() {
    this.wallet = new WalletBackground(this);
    this.account = new AccountBackground(this);
    this.network = new NetworkBackground(this);
    this.accountDetail = new AccountDetailBackground(this);
  }

  public onInitFinished = (className: string) => {
    this.initFinished[className] = true;

    if (every(this.initFinished)) {
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.ROUTE_LOGIN });
    }
  }
}

// Add instance to window for debugging
const bg = new Background();
declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    bg: Background;
  }
}
window.bg = bg;
