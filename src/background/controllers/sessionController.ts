import QryptoController from '.';
import IController from './iController';
import { MESSAGE_TYPE, RESPONSE_TYPE } from '../../constants';

export default class SessionController extends IController {
  public sessionTimeout?: number = undefined;

  private sessionLogoutInterval: number = 600000; // in ms

  constructor(main: QryptoController) {
    super('session', main);

    chrome.runtime.onMessage.addListener(this.handleMessage);

    // When popup is opened
    chrome.runtime.onConnect.addListener((port) => {
      this.onPopupOpened();

      // Add listener for when popup is closed
      port.onDisconnect.addListener(() => this.onPopupClosed());
    });

    this.initFinished();
  }

  /*
  * Clears all the intervals throughout the app.
  */
  public clearAllIntervals = () => {
    this.main.account.stopPolling();
    this.main.token.stopPolling();
    this.main.external.stopPolling();
    this.main.transaction.stopPolling();
  }

  /*
  * Closes the current session and resets all the necessary session values.
  */
  public clearSession = () => {
    this.main.account.resetAccount();
    this.main.token.resetTokenList();
  }

  /*
  * Actions taken when the popup is opened.
  */
  private onPopupOpened = () => {
    // If port is reconnected (user reopened the popup), clear sessionTimeout
    clearTimeout(this.sessionTimeout);
  }

  /*
  * Actions taken when the popup is closed..
  */
  private onPopupClosed = () => {
    this.clearAllIntervals();

    // Logout from bgp after interval
    this.sessionTimeout = window.setTimeout(() => {
      this.clearSession();
      this.main.crypto.resetPasswordHash();
      console.log('Session cleared');
    },  this.sessionLogoutInterval);
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.RESTORE_SESSION:
        if (this.main.account.loggedInAccount) {
          sendResponse(RESPONSE_TYPE.RESTORING_SESSION);
          this.main.account.onAccountLoggedIn();
        } else if (this.main.crypto.hasValidPasswordHash()) {
          sendResponse(RESPONSE_TYPE.RESTORING_SESSION);
          this.main.account.routeToAccountPage();
        }
        break;
      case MESSAGE_TYPE.GET_SESSION_LOGOUT_INTERVAL:
        sendResponse(this.sessionLogoutInterval);
        break;
      case MESSAGE_TYPE.SAVE_SESSION_LOGOUT_INTERVAL:
        this.sessionLogoutInterval = request.value;
        break;
      default:
        break;
    }
  }
}
