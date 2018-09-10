import QryptoController from '.';
import IController from './iController';
import { MESSAGE_TYPE } from '../../constants';

export default class InpageAccountController extends IController {

  constructor(main: QryptoController) {
    super('inpageAccount', main);
    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.initFinished();
  }

  public sendQryptoAccountValuesToActiveTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([{ id: tabID }]) => {
      chrome.tabs.sendMessage(tabID!, {
        type: MESSAGE_TYPE.SEND_INPAGE_QRYPTO_ACCOUNT_VALUES,
        accountValues: this.inpageQryptoAccountValues(),
      });
    });
  }

  private inpageQryptoAccountValues = () => {
    if (this.main.account.loggedInAccount) {
      // loggedInAccount!.wallet is always defined if loggedInAccount is defined, but info may not be if the fetch request failed
      if (this.main.account.loggedInAccount!.wallet!.info) {
        return { loggedIn: true,
          name: this.main.account.loggedInAccount!.name,
          network: this.main.network.networkName,
          address: this.main.account.loggedInAccount!.wallet!.info!.addrStr,
          balance: this.main.account.loggedInAccount!.wallet!.info!.balance,
        };
      }

      return {
        loggedIn: true,
        name: this.main.account.loggedInAccount!.name,
        network: this.main.network.networkName,
      };
    }
    return { loggedIn: false };
  }

  private handleMessage = (request: any) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_INPAGE_QRYPTO_ACCOUNT_VALUES:
        this.sendQryptoAccountValuesToActiveTab();
        break;
      default:
        break;
    }
  }
}
