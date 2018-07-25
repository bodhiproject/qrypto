import { every } from 'lodash';

import CryptoBackground from './cryptoBackground';
import WalletBackground from './walletBackground';
import TokenBackground from './tokenBackground';
import AccountBackground from './accountBackground';
import NetworkBackground from './networkBackground';
import ExternalBackground from './externalBackground';
import RPCBackground from './rpcBackground';
import AccountDetailBackground from './accountDetailBackground';
import SessionBackground from './sessionBackground';
import { MESSAGE_TYPE } from '../constants';

export default class Background {
  public crypto: CryptoBackground;
  public wallet: WalletBackground;
  public token: TokenBackground;
  public account: AccountBackground;
  public network: NetworkBackground;
  public external: ExternalBackground;
  public rpc: RPCBackground;
  public accountDetail: AccountDetailBackground;
  public session: SessionBackground;
  public initFinished: object = {
    crypto: false,
    wallet: false,
    token: false,
    account: false,
    network: false,
    external: false,
    rpc: false,
    accountDetail: false,
    session: false,
  };

  constructor() {
    this.crypto = new CryptoBackground(this);
    this.wallet = new WalletBackground(this);
    this.token = new TokenBackground(this);
    this.account = new AccountBackground(this);
    this.network = new NetworkBackground(this);
    this.external = new ExternalBackground(this);
    this.rpc = new RPCBackground(this);
    this.accountDetail = new AccountDetailBackground(this);
    this.session = new SessionBackground(this);
  }

  /*
  * Routes to the login page after all Chrome storage values have been fetched.
  */
  public onInitFinished = (className: string) => {
    this.initFinished[className] = true;

    if (every(this.initFinished)) {
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.ROUTE_LOGIN });
    }
  }
}

// Add instance to window for debugging
const bg = new Background();
Object.assign(window, { bg });
