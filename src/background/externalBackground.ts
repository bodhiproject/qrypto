import axios from 'axios';

import Background from '.';
import { MESSAGE_TYPE } from '../constants';

const INIT_VALUES = {
  getPriceInterval: undefined,
  qtumPriceUSD: 0,
};

export default class ExternalBackground {
  private static GET_PRICE_INTERVAL_MS: number = 60000;

  public get qtumBalanceUSD(): string {
    const info = this.bg.wallet.info;
    return (this.qtumPriceUSD && info) ? (this.qtumPriceUSD * info.balance).toFixed(2) : 'Loading';
  }

  private bg: Background;
  private getPriceInterval?: number = INIT_VALUES.getPriceInterval;
  private qtumPriceUSD: number = INIT_VALUES.qtumPriceUSD;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.bg.onInitFinished('external');
  }

  /*
  * Starts polling for periodic info updates.
  */
  public startPolling = async () => {
    await this.getQtumPrice();
    if (!this.getPriceInterval) {
      this.getPriceInterval = window.setInterval(() => {
        this.getQtumPrice();
      }, ExternalBackground.GET_PRICE_INTERVAL_MS);
    }
  }

  /*
  * Stops polling for the periodic info updates.
  */
  public stopPolling = () => {
    if (this.getPriceInterval) {
      clearInterval(this.getPriceInterval);
      this.getPriceInterval = undefined;
    }
  }

  /*
  * Gets the current Qtum market price.
  */
  private getQtumPrice = async () => {
    try {
      const jsonObj = await axios.get('https://api.coinmarketcap.com/v2/ticker/1684/');
      this.qtumPriceUSD = jsonObj.data.data.quotes.USD.price;
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_QTUM_PRICE_RETURN, qtumBalanceUSD: this.qtumBalanceUSD });
    } catch (err) {
      console.log(err);
    }
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_QTUM_BALANCE_USD:
        sendResponse(this.qtumBalanceUSD);
        break;
      default:
        break;
    }
  }
}
