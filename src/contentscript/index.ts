
import { IExtensionMessageData, IExtensionAPIMessage, IRPCCallRequestPayload } from '../types';
import { TARGET_NAME, API_TYPE, MESSAGE_TYPE } from '../constants';
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

injectStylesheet(chrome.extension.getURL('css/modal.css'));

window.addEventListener('message', handleContentScriptMessage, false);
chrome.runtime.onMessage.addListener(handleBackgroundScriptMessage);

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

function postMessageToInpage<T>(message: IExtensionAPIMessage<T>) {
  const messagePayload: IExtensionMessageData<typeof message> = {
    target: TARGET_NAME.INPAGE,
    message,
  };
  window.postMessage(messagePayload, '*');
}

function handleRPCCallMessage(messageType: MESSAGE_TYPE, message: IRPCCallRequestPayload) {
  const { method, args, id } = message;

  // Background handles messageType if logged in
  chrome.runtime.sendMessage({ type: messageType, id, method, args }, (hasWallet) => {
    if (!hasWallet) {
      // Not logged in, send error response to Inpage
      postMessageToInpage({
        type: API_TYPE.RPC_RESONSE,
        payload: {
          id,
          error: 'Cannot find logged in account',
        },
      });
    }
  });
}

function handleContentScriptMessage(event: MessageEvent) {
  if (isMessageNotValid(event, TARGET_NAME.CONTENTSCRIPT)) {
    return;
  }

  const message: IExtensionAPIMessage<any> = event.data.message;
  switch (message.type) {
    case API_TYPE.RPC_REQUEST:
      handleRPCCallMessage(MESSAGE_TYPE.RPC_CALL, message.payload);
      break;
    case API_TYPE.RPC_SEND_TO_CONTRACT:
      handleRPCCallMessage(MESSAGE_TYPE.EXTERNAL_SEND_TO_CONTRACT, message.payload);
      break;
    default:
      throw Error(`Contentscript processing invalid type: ${message}`);
  }
}

function handleBackgroundScriptMessage(message: any) {
  switch (message.type) {
    case MESSAGE_TYPE.RPC_CALL_RETURN:
      const { id, error, result } = message;

      postMessageToInpage({
        type: API_TYPE.RPC_RESONSE,
        payload: {
          id,
          error,
          result,
        },
      });
      break;
    default:
      break;
  }
}
