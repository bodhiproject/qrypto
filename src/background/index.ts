import WalletBackground from './walletBackground';
import AccountBackground from './accountBackground';
import AccountDetailBackground from './accountDetailBackground';
import NetworkBackground from './networkBackground';

export default class Background {
  public wallet: WalletBackground;
  public account: AccountBackground;
  public network: NetworkBackground;
  public accountDetail: AccountDetailBackground;

  constructor() {
    this.wallet = new WalletBackground(this);
    this.account = new AccountBackground(this);
    this.network = new NetworkBackground(this);
    this.accountDetail = new AccountDetailBackground(this);
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
