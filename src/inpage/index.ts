import { IExtensionAPIMessage, IRPCCallRequest } from '../types';
import { TARGET_NAME, API_TYPE } from '../constants';
import { QryptoRPCProvider } from './QryptoRPCProvider';
import { showSignTxWindow } from './window';
import { isMessageNotValid } from '../utils';
import { IInpageAccountWrapper } from '../types';

const qryptoProvider: QryptoRPCProvider = new QryptoRPCProvider();

const qrypto = {
  rpcProvider: qryptoProvider,
  account: null,
};
let signTxUrl: string;

// Add message listeners
window.addEventListener('message', handleInpageMessage, false);

// expose apis
Object.assign(window, {
  qrypto,
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
    case API_TYPE.RPC_RESPONSE:
      return qryptoProvider.handleRpcCallResponse(message.payload);
    case API_TYPE.SEND_INPAGE_QRYPTO_ACCOUNT_VALUES:
      const accountWrapper: IInpageAccountWrapper = message.payload;
      qrypto.account = accountWrapper.account;
      if (accountWrapper.error) {
        throw accountWrapper.error;
      } else {
        console.log('window.qrypto.account has been updated');
      }
      break;
    default:
      throw Error(`Inpage processing invalid type: ${message}`);
  }
}
