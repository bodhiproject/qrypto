import WalletBackground from './walletBackground';
import AccountDetailBackground from './accountDetailBackground';

export default class Background {
  public wallet: WalletBackground;
  public accountDetail: AccountDetailBackground;

  constructor() {
    this.wallet = new WalletBackground();
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
