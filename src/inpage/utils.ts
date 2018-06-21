import { IExtensionAPIMessage, IExtensionMessageData } from '../types'
import { TARGET_NAME } from '../constants'

export function requestExtensionAPI<T>(message: IExtensionAPIMessage<T>) {
  const messagePayload: IExtensionMessageData<typeof message> = {
    target: TARGET_NAME.CONTENTSCRIPT,
    message,
  }

  window.postMessage(messagePayload, '*')
}
