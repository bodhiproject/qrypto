
import { injectAllScripts } from './inject';
import { IExtensionAPIMessage, IRPCCallRequest, IRPCCallResponse, ICurrentAccount } from '../types';
import { TARGET_NAME, API_TYPE, MESSAGE_TYPE, RPC_METHOD } from '../constants';
import { isMessageNotValid } from '../utils';
import { postWindowMessage } from '../utils/messenger';

// Inject scripts
injectAllScripts();

// Add message listeners
window.addEventListener('message', handleInPageMessage, false);
chrome.runtime.onMessage.addListener(handleBackgroundScriptMessage);

// const port = chrome.runtime.connect({ name: PORT_NAME.CONTENTSCRIPT });
// port.onMessage.addListener(responseExtensionAPI);

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

function handleInpageQryptoAccountRequest() {
  chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_INPAGE_QRYPTO_ACCOUNT_VALUES_2 }, (accountValues) => {
      postWindowMessage(TARGET_NAME.INPAGE, {
        type: API_TYPE.RETURN_INPAGE_QRYPTO_ACCOUNT_VALUES,
        payload: accountValues,
      });
  });
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
    case API_TYPE.GET_INPAGE_QRYPTO_ACCOUNT_VALUES_1:
      handleInpageQryptoAccountRequest();
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
