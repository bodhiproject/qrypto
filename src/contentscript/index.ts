import chromeCall from 'chrome-call';
import { WalletRPCProvider, networks, Wallet, Network } from 'qtumjs-wallet';

import { IExtensionMessageData, IExtensionAPIMessage, IRPCCallRequestPayload } from '../types';
import { TARGET_NAME, API_TYPE, STORAGE } from '../constants';

injectScript(chrome.extension.getURL('commons.all.js')).then(async () => {
  await injectScript(chrome.extension.getURL('commons.exclude-background.js'));
  await injectScript(chrome.extension.getURL('commons.exclude-contentscript.js'));
  await injectScript(chrome.extension.getURL('commons.exclude-popup.js'));
  await injectScript(chrome.extension.getURL('commons.background-inpage.js'));
  await injectScript(chrome.extension.getURL('commons.contentscript-inpage.js'));
  await injectScript(chrome.extension.getURL('commons.popup-inpage.js'));
  await injectScript(chrome.extension.getURL('inpage.js'));
});

injectStylesheet(chrome.extension.getURL('css/modal.css'));

window.addEventListener('message', handleWebPageMessage, false);

// const port = chrome.runtime.connect({ name: PORT_NAME.CONTENTSCRIPT });
// port.onMessage.addListener(responseExtensionAPI);

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

const origin = location.origin;
function handleWebPageMessage(event: MessageEvent) {
  // validate message
  const data: IExtensionMessageData<any> = event.data;
  if (
    event.origin !== origin ||
    event.source !== window ||
    typeof data !== 'object' ||
    data.message == null ||
    data.target !== TARGET_NAME.CONTENTSCRIPT
  ) {
    return;
  }

  const message: IExtensionAPIMessage<any> = data.message;
  switch (message.type) {
    case API_TYPE.RPC_REQUEST:
      handleRPCCallMessage(message.payload);
      break;
    default:
      console.log('receive unknown type message from webpage:', data.message);
  }
}

function responseExtensionAPI<T>(message: IExtensionAPIMessage<T>) {
  const messagePayload: IExtensionMessageData<typeof message> = {
    target: TARGET_NAME.INPAGE,
    message,
  };

  window.postMessage(messagePayload, '*');
}

async function handleRPCCallMessage(message: IRPCCallRequestPayload) {
  const { method, args, id } = message;
  const storage = await chromeCall(chrome.storage.local, 'get', STORAGE.LOGGED_IN_ACCOUNT);

  if (!(storage && storage.loggedInAccount)) {
    return responseExtensionAPI({
      type: API_TYPE.RPC_RESONSE,
      payload: {
        id,
        error: 'can not find logged in account',
      },
    });
  }

  const { loggedInAccount: { isMainNet, name, privateKeyHash, passwordHash } } = storage;
  const provider = await getRpcProvider(isMainNet, privateKeyHash, passwordHash);
  const result = await provider.rawCall(method, args);
  console.log(`using account '${name}' to call rpc method: '${method}'`);

  responseExtensionAPI({
    type: API_TYPE.RPC_RESONSE,
    payload: {
      id,
      result,
    },
  });
}

async function getRpcProvider(
  isMainNet: boolean,
  privateKeyHash: string,
  passwordHash: string,
): Promise<WalletRPCProvider> {
  const network: Network = networks[isMainNet ? 'mainnet' : 'testnet'];
  const wallet: Wallet = await network.fromEncryptedPrivateKey(privateKeyHash, passwordHash, { N: 8192, r: 8, p: 1 });
  return new WalletRPCProvider(wallet);
}
