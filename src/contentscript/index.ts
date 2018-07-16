import chromeCall from 'chrome-call';

import {
  IExtensionMessageData,
  IExtensionAPIMessage,
  IRPCCallRequestPayload,
} from '../types';

import { WalletRPCProvider } from 'qtumjs-wallet';

import { TARGET_NAME, API_TYPE } from '../constants';
import { networks, Wallet} from 'qtumjs-wallet';

injectScript(chrome.extension.getURL('commons.all.js')).then(async () => {
  await injectScript(chrome.extension.getURL('commons.exclude-background.js'));
  await injectScript(chrome.extension.getURL('commons.exclude-contentscript.js'));
  await injectScript(chrome.extension.getURL('commons.exclude-popup.js'));
  await injectScript(chrome.extension.getURL('commons.background-inpage.js'));
  await injectScript(chrome.extension.getURL('commons.contentscript-inpage.js'));
  await injectScript(chrome.extension.getURL('commons.popup-inpage.js'));
  await injectScript(chrome.extension.getURL('inpage.js'));
});

window.addEventListener('message', handleWebPageMessage, false);

// const port = chrome.runtime.connect({ name: PORT_NAME.CONTENTSCRIPT });
// port.onMessage.addListener(responseExtensionAPI);

function injectScript(src: string) {
  return new Promise((resolve) => {
    const scriptElement = document.createElement('script');
    const headOrDocumentElement = document.head || document.documentElement;

    scriptElement.onload = function onScriptLoad() {
      resolve();
    };
    scriptElement.src = src;
    headOrDocumentElement.insertAdjacentElement('afterbegin', scriptElement);
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
  const storage = await chromeCall(chrome.storage.local, 'get', 'currentAccount');

  if (!(storage && storage.currentAccount)) {
    return responseExtensionAPI({
      type: API_TYPE.RPC_RESONSE,
      payload: {
        id,
        error: 'can not found logged account',
      },
    });
  }

  const { currentAccount: { isMainNet, mnemonic, name } } = storage;

  const wallet = await recoverWallet(isMainNet, mnemonic);

  const provider = new WalletRPCProvider(wallet);

  console.log(`using account '${name}' to call rpc method: '${method}'`);

  const result = await provider.rawCall(method, args);

  responseExtensionAPI({
    type: API_TYPE.RPC_RESONSE,
    payload: {
      id,
      result,
    },
  });
}

function recoverWallet(isMainNet: boolean, mnemonic: string): Promise<Wallet> {
  const network = networks[isMainNet ? 'testnet' : 'testnet'];
  return network.fromMnemonic(mnemonic);
}
