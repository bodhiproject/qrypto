import Background from '.';
import { MESSAGE_TYPE, RESPONSE_TYPE } from '../constants';

export default class SessionBackground {
  private static SESSION_LOGOUT_INTERVAL_MS: number = 600000;

  public sessionTimeout?: number = undefined;

  private bg: Background;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.handleMessage);

    // When popup is opened
    chrome.runtime.onConnect.addListener((port) => {
      this.onPopupOpened();

      // Add listener for when popup is closed
      port.onDisconnect.addListener(() => this.onPopupClosed());
    });

    this.bg.onInitFinished('session');
  }

  /*
  * Clears all the intervals throughout the app.
  */
  public clearAllIntervals = () => {
    this.bg.wallet.stopPolling();
    this.bg.token.stopPolling();
    this.bg.external.stopPolling();
    this.bg.transaction.stopPolling();
  }

  /*
  * Closes the current session and resets all the necessary session values.
  */
  public clearSession = () => {
    this.bg.account.resetAccount();
    this.bg.wallet.resetWallet();
    this.bg.rpc.reset();
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
      this.bg.crypto.resetPasswordHash();
      console.log('Session cleared');
    },  SessionBackground.SESSION_LOGOUT_INTERVAL_MS);
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.RESTORE_SESSION:
        if (this.bg.wallet.wallet && this.bg.account.loggedInAccount) {
          sendResponse(RESPONSE_TYPE.RESTORING_SESSION);
          this.bg.account.onAccountLoggedIn();
        } else if (this.bg.crypto.hasValidPasswordHash()) {
          sendResponse(RESPONSE_TYPE.RESTORING_SESSION);
          this.bg.account.routeToAccountPage();
        }
        break;
      default:
        break;
    }
  }
}
