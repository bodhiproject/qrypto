import { API_TYPE } from '../constants'
import { requestExtensionAPI } from './utils'
import { ISendQtumResponsePayload, ISendQtumRequestPayload } from '../types'

const processingSendQtumRequests: { [id: string]: ISendQtumRequest } = {}

export function sendToAddress(address: string, amount: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString().slice(-8)
    processingSendQtumRequests[id] = { resolve, reject }

    requestExtensionAPI<ISendQtumRequestPayload>({
      type: API_TYPE.SEND_QTUM_REQUEST,
      payload: { address, amount, id },
    })
  })
}

export function handleSendToAddressResponse(response: ISendQtumResponsePayload) {
  const request = processingSendQtumRequests[response.id]
  if (!request) {
    return
  }

  delete processingSendQtumRequests[response.id]

  if (response.error != null) {
    request.reject(response.error)

    return
  }
  console.log('转账成功')
  request.resolve(response.result)
}

interface ISendQtumRequest {
  resolve: (result?: any) => void
  reject: (reason?: any) => void
}
