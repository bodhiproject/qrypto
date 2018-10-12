const extension = require('extensionizer');

import { API_TYPE, TARGET_NAME } from '../constants';
import { postWindowMessage } from '../utils/messenger';

function injectScript(src: string) {
  return new Promise((resolve) => {
    const scriptElement = document.createElement('script');
    const headOrDocumentElement = document.head || document.documentElement;

    scriptElement.onload = () => resolve();
    scriptElement.src = src;
    headOrDocumentElement.insertAdjacentElement('afterbegin', scriptElement);
  });
}

function injectStylesheet(src: string) {
  return new Promise((resolve) => {
    const styleElement = document.createElement('link');
    const headOrDocumentElement = document.head || document.documentElement;

    styleElement.onload = () => resolve();
    styleElement.rel = 'stylesheet';
    styleElement.href = src;
    headOrDocumentElement.insertAdjacentElement('afterbegin', styleElement);
  });
}

export async function injectAllScripts() {
  await injectScript(extension.extension.getURL('commons.all.js')).then(async () => {
    await injectScript(extension.extension.getURL('commons.exclude-background.js'));
    await injectScript(extension.extension.getURL('commons.exclude-contentscript.js'));
    await injectScript(extension.extension.getURL('commons.exclude-popup.js'));
    await injectScript(extension.extension.getURL('commons.background-inpage.js'));
    await injectScript(extension.extension.getURL('commons.contentscript-inpage.js'));
    await injectScript(extension.extension.getURL('commons.popup-inpage.js'));
    await injectScript(extension.extension.getURL('inpage.js'));

    // Pass the extension extension absolute URL of the Sign Transaction dialog to the Inpage
    const signTxUrl = extension.extension.getURL('sign-tx.html');
    postWindowMessage(TARGET_NAME.INPAGE, {
      type: API_TYPE.SIGN_TX_URL_RESOLVED,
      payload: { url: signTxUrl },
    });
  });

  injectStylesheet(extension.extension.getURL('css/modal.css'));
}
