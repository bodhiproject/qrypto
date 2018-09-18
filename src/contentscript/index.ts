
import { injectAllScripts } from './inject';
import { IExtensionAPIMessage, IRPCCallRequest, IRPCCallResponse, ICurrentAccount } from '../types';
import { TARGET_NAME, API_TYPE, MESSAGE_TYPE, RPC_METHOD, PORT_NAME } from '../constants';
import { isMessageNotValid } from '../utils';
import { postWindowMessage } from '../utils/messenger';

let port: any;

// Inject scripts
injectAllScripts();

// Add message listeners
window.addEventListener('message', handleInPageMessage, false);
chrome.runtime.onMessage.addListener(handleBackgroundScriptMessage);
// Dapp developer triggers this event to set up window.qrypto
window.addEventListener('message', setupLongLivedConnection, false);

// Create a long-lived connection to the background page
function setupLongLivedConnection(event: MessageEvent) {
  if (event.data.message && event.data.message.type === API_TYPE.CONNECT_INPAGE_QRYPTO) {
    port = chrome.runtime.connect({ name: PORT_NAME.CONTENTSCRIPT });

    port.onMessage.addListener((msg: any) => {
      if (msg.type === MESSAGE_TYPE.SEND_INPAGE_QRYPTO_ACCOUNT_VALUES) {
        // content script -> inpage and/or Dapp event listener
        postWindowMessage(TARGET_NAME.INPAGE, {
          type: API_TYPE.SEND_INPAGE_QRYPTO_ACCOUNT_VALUES,
          payload: msg.accountWrapper,
        });
      }
    });

    /*
    * Triggers when port is disconnected from other end, such as when extension is uninstalled,
    * but only if a long-lived connection was created first.
    * No chrome.runtime.onUninstalled event exists.
    * Does not trigger when user closes the tab, or navigates to another page.
    */
    port.onDisconnect.addListener(() => {
      handlePortDisconnected();
    });

    // request inpageAccount values from bg script
    postWindowMessage(TARGET_NAME.CONTENTSCRIPT, {
      type: API_TYPE.GET_INPAGE_QRYPTO_ACCOUNT_VALUES,
      payload: {},
    });
  }
}

/*
* Resetting the state of the webpage this way is a bit fragile. We can remove the
* event listeners and reset window.qrypto, but there is no way to uninject the
* content scripts, which means that on reinstallation, we are injecting the
* scripts twice. So far this has been okay, but if it causes unpredictable side
* effects we could alternatively force a reload of the page using
* window.location.reload()
*/
function handlePortDisconnected() {
  window.removeEventListener('message', handleInPageMessage, false);
  window.removeEventListener('message', setupLongLivedConnection, false);

  postWindowMessage(TARGET_NAME.INPAGE, {
    type: API_TYPE.PORT_DISCONNECTED,
    payload: {},
  });
}

function handleRPCRequest(message: IRPCCallRequest) {
  const { method, args, id } = message;

  // Check for logged in account first
  chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_LOGGED_IN_ACCOUNT }, (account: ICurrentAccount) => {
    if (!account) {
      // Not logged in, send error response to Inpage
      postWindowMessage<IRPCCallResponse>(TARGET_NAME.INPAGE, {
        type: API_TYPE.RPC_RESPONSE,
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
        postWindowMessage<IRPCCallRequest>(TARGET_NAME.INPAGE, {
          type: API_TYPE.RPC_SEND_TO_CONTRACT,
          payload: {
            ...message,
            account,
          },
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

// Forwards the request to the bg script
function forwardInpageAccountRequest() {
  port.postMessage({ type: MESSAGE_TYPE.GET_INPAGE_QRYPTO_ACCOUNT_VALUES });
}

// Handle messages sent from inpage -> content script(here) -> bg script
function handleInPageMessage(event: MessageEvent) {
  if (isMessageNotValid(event, TARGET_NAME.CONTENTSCRIPT)) {
    return;
  }

  const message: IExtensionAPIMessage<any> = event.data.message;
  switch (message.type) {
    case API_TYPE.RPC_REQUEST:
      handleRPCRequest(message.payload);
      break;
    case API_TYPE.GET_INPAGE_QRYPTO_ACCOUNT_VALUES:
      forwardInpageAccountRequest();
      break;
    default:
      throw Error(`Contentscript processing invalid type: ${message}`);
  }
}

// Handle messages sent from bg script -> content script(here) -> inpage
function handleBackgroundScriptMessage(message: any) {
  switch (message.type) {
    case MESSAGE_TYPE.EXTERNAL_RPC_CALL_RETURN:
      postWindowMessage<IRPCCallResponse>(TARGET_NAME.INPAGE, {
        type: API_TYPE.RPC_RESPONSE,
        payload: message,
      });
      break;
    default:
      break;
  }
}
