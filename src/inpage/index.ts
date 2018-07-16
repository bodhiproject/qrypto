import { IExtensionMessageData, IExtensionAPIMessage } from '../types';
import { TARGET_NAME, API_TYPE } from '../constants';
import { handleRPCCallResponse } from './rpcCall';
import { QryptoRPCProvider } from './QryptoRPCProvider';

window.addEventListener('message', handleContentScriptMessage, false);

// expose apis
Object.assign(window, {
  qryptoRPCProvider: new QryptoRPCProvider(),
});

const origin = location.origin;
function handleContentScriptMessage(event: MessageEvent) {
  // validate message
  const data: IExtensionMessageData<any> = event.data;
  if (
    event.origin !== origin ||
    event.source !== window ||
    typeof data !== 'object' ||
    data.message == null ||
    data.target !== TARGET_NAME.INPAGE
  ) {
    return;
  }

  const message: IExtensionAPIMessage<any> = data.message;
  switch (message.type) {
    case API_TYPE.RPC_RESONSE:
      return handleRPCCallResponse(message.payload);
    default:
      console.log('receive unknown type message from contentscript:', data.message);
  }
}
