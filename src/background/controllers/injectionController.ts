import QryptoController from '.';
import IController from './iController';

/*
* Content scripts are injected automatically through the manifest.json when a page
* is loaded, this controller is for handling pages that were loaded prior to
* installation of the extension.
*/

export default class InjectionController extends IController {
  private chromeManifest: any;

  constructor(main: QryptoController) {
    super('injection', main);

    this.chromeManifest = chrome.runtime.getManifest();

    /* Inject content scripts and add event listeners to all existing tabs.
    Note that in some cases these pages may already have the content script
    (i.e. if the extension was uninstalled/reinstalled),
    so we are doubling/re-injecting the content scripts. This has not caused any
    problems at present, but a simple alternative would be to refresh all the tabs.
    */
    chrome.runtime.onInstalled.addListener((details) => {
      /*
      * if extension is being newly installed or prior version was before 1.3.1
      * (window.qrypto.account was added in v1.3.1)
      */
      if (details.reason === 'install'
        || (details.reason === 'update' && details.previousVersion! < '1.3.1')) {
        this.injectIntoAllTabs();
      }
    });

    this.initFinished();
  }

  public injectIntoAllTabs = () => {
    // Get all windows
    chrome.windows.getAll({
      populate: true,
    }, (windows) => {
        for (const currentWindow of windows ) {
          if (currentWindow.tabs) {
            for (const currentTab of currentWindow.tabs ) {
                // Skip chrome:// by checking for currentTab.url (chrome:// does not have a .url)
                if (currentTab.url) {
                  this.injectIntoTab(currentTab);
                }
            }
          }
        }
    });
  }

  // Iterate through the content scripts and inject each 1
  public injectIntoTab = (tab: chrome.tabs.Tab) => {
    if (this.chromeManifest) {
      const scripts = this.chromeManifest.content_scripts[0].js;
      for (const script of scripts) {
        if (tab.id) {
          chrome.tabs.executeScript(tab.id, {
            file: script,
          });
        }
      }
    }
  }
}
