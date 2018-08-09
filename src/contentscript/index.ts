
import { injectAllScripts } from './inject';
import { IExtensionMessageData, IExtensionAPIMessage, IRPCCallRequest } from '../types';
import { TARGET_NAME, API_TYPE, MESSAGE_TYPE, RPC_METHOD } from '../constants';
import { isMessageNotValid } from '../utils';

// Inject scripts
injectAllScripts();

window.addEventListener('message', handleContentScriptMessage, false);
chrome.runtime.onMessage.addListener(handleBackgroundScriptMessage);

// const port = chrome.runtime.connect({ name: PORT_NAME.CONTENTSCRIPT });
// port.onMessage.addListener(responseExtensionAPI);

function postMessageToInpage<T>(message: IExtensionAPIMessage<T>) {
  const messagePayload: IExtensionMessageData<typeof message> = {
    target: TARGET_NAME.INPAGE,
    message,
  };
  window.postMessage(messagePayload, '*');
}

function handleRPCRequest(message: IRPCCallRequest) {
  const { method, args, id } = message;

  // Check for logged in account first
  chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_LOGGED_IN_ACCOUNT_NAME }, (accountName: any) => {
    if (!accountName) {
      // Not logged in, send error response to Inpage
      postMessageToInpage({
        type: API_TYPE.RPC_RESONSE,
        payload: {
          id,
          error: 'Not logged in. Please log in to Qrypto first.',
        },
      });
      return;
    }

    switch (method) {
      case RPC_METHOD.SEND_TO_CONTRACT:
        // Inpage shows sign tx popup
        postMessageToInpage({
          type: API_TYPE.RPC_SEND_TO_CONTRACT,
          payload: message,
        });
        break;
      case RPC_METHOD.CALL_CONTRACT:
        // Background executes callcontract
        chrome.runtime.sendMessage({ type: MESSAGE_TYPE.EXTERNAL_CALL_CONTRACT, id, args });
        break;
      default:
        throw Error('Unhandled RPC method.');
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
      handleRPCRequest(message.payload);
      break;
    default:
      throw Error(`Contentscript processing invalid type: ${message}`);
  }
}

function handleBackgroundScriptMessage(message: any) {
  switch (message.type) {
    case MESSAGE_TYPE.EXTERNAL_RPC_CALL_RETURN:
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
