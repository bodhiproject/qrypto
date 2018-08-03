import axios from 'axios';

import Background from '.';
import { MESSAGE_TYPE } from '../constants';

const INIT_VALUES = {
  getPriceInterval: undefined,
  qtumPriceUSD: 0,
};

export default class ExternalBackground {
  private static GET_PRICE_INTERVAL_MS: number = 60000;

  private bg: Background;
  private getPriceInterval?: number = INIT_VALUES.getPriceInterval;
  private qtumPriceUSD: number = INIT_VALUES.qtumPriceUSD;

  constructor(bg: Background) {
    this.bg = bg;
    this.bg.onInitFinished('external');
  }

  public calculateQtumToUSD = (balance: number): number => {
    return this.qtumPriceUSD ? Number((this.qtumPriceUSD * balance).toFixed(2)) : 0;
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

      if (this.bg.account.loggedInAccount
        && this.bg.account.loggedInAccount.wallet
        && this.bg.account.loggedInAccount.wallet.info
      ) {
        const qtumUSD = this.calculateQtumToUSD(this.bg.account.loggedInAccount.wallet.info.balance);
        this.bg.account.loggedInAccount.wallet.qtumUSD = qtumUSD;

        chrome.runtime.sendMessage({
          type: MESSAGE_TYPE.GET_QTUM_USD_RETURN,
          qtumUSD,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
