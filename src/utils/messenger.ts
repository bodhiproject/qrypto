import { IExtensionAPIMessage, IExtensionMessageData } from '../types';
import { TARGET_NAME } from '../constants';

export function postWindowMessage<T>(target: TARGET_NAME, message: IExtensionAPIMessage<T>) {
  const messagePayload: IExtensionMessageData<typeof message> = { target, message };
  window.postMessage(messagePayload, '*');
}
