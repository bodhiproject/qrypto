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
      // If port is reconnected(user reopened the popup), clear sessionTimeout
      clearTimeout(this.sessionTimeout);

      // Add listener for when popup is closed
      port.onDisconnect.addListener(() => {
        this.bg.wallet.stopPolling();
        this.bg.external.stopPolling();
        this.bg.accountDetail.stopPolling();
        // Logout from bgp after interval
        this.sessionTimeout = window.setTimeout(() => {
          this.bg.crypto.resetPasswordHash();
          this.bg.account.logoutAccount();
          console.log('sessionTimeout - passwordHash and wallet cleared');
        },  SessionBackground.SESSION_LOGOUT_INTERVAL_MS);
      });
    });
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.RESTORE_SESSION:
        if (this.bg.wallet.wallet && this.bg.account.loggedInAccount) {
          sendResponse(RESPONSE_TYPE.LOADING);
          this.bg.account.onAccountLoggedIn();
        } else if (this.bg.crypto.hasValidPasswordHash()) {
          sendResponse(RESPONSE_TYPE.LOADING);
          this.bg.account.routeToAccountPage();
        }
        break;
    }
  }
}
