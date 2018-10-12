// const extension = require('extensionizer')
const extension = require('extensionizer');

import QryptoController from '.';
import IController from './iController';

export default class OnInstallController extends IController {
  constructor(main: QryptoController) {
    super('onInstall', main);

    /*
    * When the extension is installed or updated, refresh the tabs of all
    * dapp apps using Qrypto. We want to refresh these tabs so that they can
    * have a clean slate for adding event listeners and injecting scripts,
    * and so that we do not have any dangling/duplicate event listeners or
    * injected scripts from prior versions of Qrypto.
    * To get refreshed, dapp tabs must implement the
    * handleQryptoInstallOrUpdate event listener described in the Readme.
    */
    extension.runtime.onInstalled.addListener((details: extension.runtime.InstalledDetails) => {
      if (details.reason === 'install' || details.reason === 'update') {
        this.refreshAllDappTabs();
      }
    });

    this.initFinished();
  }

  public refreshAllDappTabs = () => {
    // Get all windows
    extension.windows.getAll({
      populate: true,
    }, (windows) => {
        for (const currentWindow of windows) {
          if (currentWindow.tabs) {
            for (const currentTab of currentWindow.tabs) {
              // Skip chrome:// by checking for currentTab.url (chrome:// does not have a .url)
              if (currentTab.url) {
                this.refreshTab(currentTab);
              }
            }
          }
        }
    });
  }

  private refreshTab(tab: extension.tabs.Tab) {
     // Tells the content script to post a msg to the inpage window letting it know that Qrypto was installed or updated.
     extension.tabs.executeScript(tab.id!, {code:
      `window.postMessage(
        {
          message: { type: 'QRYPTO_INSTALLED_OR_UPDATED' }
        },
        '*'
      )`,
    });
  }
}
