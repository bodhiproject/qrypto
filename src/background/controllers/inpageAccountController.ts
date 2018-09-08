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
        type: MESSAGE_TYPE.SEND_INPAGE_QRYPTO_ACCOUNT_VALUES_1,
        accountValues: this.inpageQryptoAccountValues(),
      });
    });
  }

  private inpageQryptoAccountValues = () => {
    const res = this.main.account.loggedInAccount ? {
      accountIsLoggedIn: true,
      name: this.main.account.loggedInAccount!.name,
      network: this.main.network.networkName,
      address: this.main.account.loggedInAccount!.wallet!.info!.addrStr,
      balance: this.main.account.loggedInAccount!.wallet!.info!.balance,
    } : { accountIsLoggedIn: false };
    return res;
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_INPAGE_QRYPTO_ACCOUNT_VALUES_2:
        this.sendQryptoAccountValuesToActiveTab();
        break;
      default:
        break;
    }
  }
}
