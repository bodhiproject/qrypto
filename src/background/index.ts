import { TARGET_NAME } from '../constants';
import { isMessageNotValid } from '../utils';

window.addEventListener('message', handleBackgroundMessage, false);

function handleBackgroundMessage(event: MessageEvent) {
  if (isMessageNotValid(event, TARGET_NAME.BACKGROUND)) {
    return;
  }

  const message: IExtensionAPIMessage<any> = event.data.message;
  switch (message.type) {
    case API_TYPE.RPC_RESONSE:
      return handleRpcCallResponse(message.payload);
    default:
      throw Error(`Background processing invalid type: ${message}`);
  }
}
