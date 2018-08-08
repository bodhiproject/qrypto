import { template } from 'lodash';
import { IExtensionAPIMessage } from '../types';
import { TARGET_NAME, API_TYPE } from '../constants';
import { QryptoRPCProvider } from './QryptoRPCProvider';
import { showModal, closeModal } from './modal';
import { showSignTxWindow } from './window';
import { isMessageNotValid } from '../utils';

const qryptoRpcProvider = new QryptoRPCProvider();

window.addEventListener('message', handleInpageMessage, false);

// expose apis
Object.assign(window, {
  qryptoRpcProvider,
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
  testWindow: () => showSignTxWindow(),
});

function handleInpageMessage(event: MessageEvent) {
  if (isMessageNotValid(event, TARGET_NAME.INPAGE)) {
    return;
  }

  const message: IExtensionAPIMessage<any> = event.data.message;
  switch (message.type) {
    case API_TYPE.RPC_RESONSE:
      return qryptoRpcProvider.handleRpcCallResponse(message.payload);
    default:
      throw Error(`Inpage processing invalid type: ${message}`);
  }
}
