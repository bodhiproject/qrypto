import { IExtensionAPIMessage } from '../types';
import { TARGET_NAME, API_TYPE } from '../constants';
import { handleRpcCallResponse } from './utils';
import { QryptoRpcProvider } from './QryptoRPCProvider';
import { isMessageNotValid } from '../utils';

window.addEventListener('message', handleInpageMessage, false);

// expose apis
Object.assign(window, {
  qryptoRpcProvider: new QryptoRpcProvider(),
});

function handleInpageMessage(event: MessageEvent) {
  if (isMessageNotValid(event, TARGET_NAME.INPAGE)) {
    return;
  }

  const message: IExtensionAPIMessage<any> = event.data.message;
  switch (message.type) {
    case API_TYPE.RPC_RESONSE:
      return handleRpcCallResponse(message.payload);
    default:
      throw Error(`Inpage processing invalid type: ${message}`);
  }
}
