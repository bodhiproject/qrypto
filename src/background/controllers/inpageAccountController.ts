import QryptoController from '.';
import IController from './iController';
import { MESSAGE_TYPE, PORT_NAME } from '../../constants';
import { InpageAccount } from '../../models/InpageAccount';

export default class InpageAccountController extends IController {

  // All connected ports from content script
  private ports: any[] = [];

  constructor(main: QryptoController) {
    super('inpageAccount', main);
    chrome.runtime.onConnect.addListener(this.handleLongLivedConnection);

    this.initFinished();
  }

  // Send message to and update qrypto.account object of all registered ports
  public sendInpageAccountAllPorts = () => {
    for (const port of this.ports) {
      this.sendInpageAccount(port);
    }
  }

  // bg -> content script
  public sendInpageAccount = (port: any) => {
    port.postMessage({
      type: MESSAGE_TYPE.SEND_INPAGE_QRYPTO_ACCOUNT_VALUES,
      accountWrapper: this.inpageAccountWrapper(),
    });
  }

  private inpageAccountWrapper = () => {
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
        return {
          account: null,
          error: Error('Unexpected error, user is logged in but wallet info is not defined') };
      }
    }
    return { account: inpageAccount, error: null };
  }

  // when a port connects
  private handleLongLivedConnection = (port: any) => {
    if (port.name !== PORT_NAME.CONTENTSCRIPT) {
      return;
    }
    this.ports.push(port);
    port.onDisconnect.addListener(this.handleDisconnect);
    port.onMessage.addListener((msg: any) => {
      if (msg.type === MESSAGE_TYPE.GET_INPAGE_QRYPTO_ACCOUNT_VALUES) {
        this.sendInpageAccount(port);
      }
    });
  }

  private handleDisconnect = (port: any) => {
    // remove disconnected port from ports array
    const portIdx = this.ports.indexOf(port);
    if (portIdx !== -1) {
      this.ports.splice(portIdx, 1);
    }
  }
}
