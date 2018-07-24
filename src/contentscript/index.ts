import chromeCall from 'chrome-call';
import { WalletRPCProvider, networks, Wallet, Network } from 'qtumjs-wallet';

import { IExtensionMessageData, IExtensionAPIMessage, IRPCCallRequestPayload } from '../types';
import { TARGET_NAME, API_TYPE, STORAGE } from '../constants';
import { isMessageNotValid } from '../utils';

injectScript(chrome.extension.getURL('commons.all.js')).then(async () => {
  await injectScript(chrome.extension.getURL('commons.exclude-background.js'));
  await injectScript(chrome.extension.getURL('commons.exclude-contentscript.js'));
  await injectScript(chrome.extension.getURL('commons.exclude-popup.js'));
  await injectScript(chrome.extension.getURL('commons.background-inpage.js'));
  await injectScript(chrome.extension.getURL('commons.contentscript-inpage.js'));
  await injectScript(chrome.extension.getURL('commons.popup-inpage.js'));
  await injectScript(chrome.extension.getURL('inpage.js'));
});

window.addEventListener('message', handleContentScriptMessage, false);

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

function handleContentScriptMessage(event: MessageEvent) {
  if (isMessageNotValid(event, TARGET_NAME.CONTENTSCRIPT)) {
    return;
  }

  const message: IExtensionAPIMessage<any> = event.data.message;
  switch (message.type) {
    case API_TYPE.RPC_REQUEST:
      handleRPCCallMessage(message.payload);
      break;
    default:
      throw Error(`Contentscript processing invalid type: ${message}`);
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
