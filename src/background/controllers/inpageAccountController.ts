import QryptoController from '.';
import IController from './iController';
import { MESSAGE_TYPE } from '../../constants';
import { InpageAccount } from '../../models/InpageAccount';

export default class InpageAccountController extends IController {

  constructor(main: QryptoController) {
    super('inpageAccount', main);
    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.initFinished();
  }

  public sendInpageAccountToActiveTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([{ id: tabID }]) => {
      chrome.tabs.sendMessage(tabID!, {
        type: MESSAGE_TYPE.SEND_INPAGE_QRYPTO_ACCOUNT_VALUES,
        account: this.inpageAccount(),
      });
    });
  }

  private inpageAccount = () => {
    const inpageAccount = new InpageAccount();
    if (this.main.account.loggedInAccount) {
      inpageAccount.loggedIn = true;
      inpageAccount.name = this.main.account.loggedInAccount!.name;
      inpageAccount.network = this.main.network.networkName;

      // loggedInAccount!.wallet is always defined if loggedInAccount is defined, but info may not be if the fetch request failed
      if (this.main.account.loggedInAccount!.wallet!.info) {
        inpageAccount.address = this.main.account.loggedInAccount!.wallet!.info!.addrStr;
        inpageAccount.balance = this.main.account.loggedInAccount!.wallet!.info!.balance;
      } else {
        return { error: 'Unexpected error, user is logged in but wallet info is not defined' };
      }
    }
    return inpageAccount;
  }

  private handleMessage = (request: any) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_INPAGE_QRYPTO_ACCOUNT_VALUES:
        this.sendInpageAccountToActiveTab();
        break;
      default:
        break;
    }
  }
}
