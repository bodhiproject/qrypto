import { template } from 'lodash';
import { IExtensionAPIMessage, IRPCCallRequest } from '../types';
import { TARGET_NAME, API_TYPE } from '../constants';
import { QryptoRPCProvider } from './QryptoRPCProvider';
import { showModal, closeModal } from './modal';
import { showSignTxWindow } from './window';
import { isMessageNotValid } from '../utils';

const qryptoProvider: QryptoRPCProvider = new QryptoRPCProvider();
let signTxUrl: string;

// Add message listeners
window.addEventListener('message', handleInpageMessage, false);

// expose apis
Object.assign(window, {
  qryptoProvider,
  testModal: async () => {
    const modal = await showModal(300, 300, {background: '#FFF'});
    const content = template(`
      <p>I'm a test Modal!</p>
      <button>close me</button>
    `);

    modal.contentDocument!.write(content());
    modal.contentDocument!.querySelector('button')!.addEventListener('click', closeModal);
    return modal;
  },
  // testWindow: () => showSignTxWindow(signTxUrl),
});

/**
 * Handles the sendToContract request originating from the QryptoRPCProvider and opens the sign tx window.
 * @param request SendToContract request.
 */
const handleSendToContractRequest = (request: IRPCCallRequest) => {
  showSignTxWindow({ url: signTxUrl, request });
};

function handleInpageMessage(event: MessageEvent) {
  if (isMessageNotValid(event, TARGET_NAME.INPAGE)) {
    return;
  }

  const message: IExtensionAPIMessage<any> = event.data.message;
  switch (message.type) {
    case API_TYPE.SIGN_TX_URL_RESOLVED:
      signTxUrl = message.payload.url;
      break;
    case API_TYPE.RPC_SEND_TO_CONTRACT:
      handleSendToContractRequest(message.payload);
      break;
    case API_TYPE.RPC_RESONSE:
      return qryptoProvider.handleRpcCallResponse(message.payload);
    default:
      throw Error(`Inpage processing invalid type: ${message}`);
  }
}
