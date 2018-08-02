import { Wallet, Insight, WalletRPCProvider } from 'qtumjs-wallet';

import Background from '.';
import { MESSAGE_TYPE } from '../constants';

const INIT_VALUES = {
  wallet: undefined,
  info: undefined,
};

export default class WalletBackground {
  public wallet?: Wallet = INIT_VALUES.wallet;
  public info?: Insight.IGetInfo = INIT_VALUES.info;

  private bg: Background;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.bg.onInitFinished('wallet');
  }

  /*
  * Resets the wallet vars back to the initial state.
  */
  public resetWallet = () => {
    this.wallet = INIT_VALUES.wallet;
    this.info =  INIT_VALUES.info;
  }

  /*
  * Executes a sendtoaddress.
  * @param receiverAddress The address to send Qtum to.
  * @param amount The amount to send.
  */
  public sendTokens = async (receiverAddress: string, amount: number) => {
    try {
      const wallet = this.wallet!;
      await wallet.send(receiverAddress, amount * 1e8, { feeRate: 4000 });
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.SEND_TOKENS_SUCCESS });
    } catch (err) {
      console.log(err);
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.SEND_TOKENS_FAILURE, error: err });
    }
  }

  private callRpc = async (id: number, method: string, args: any[]) => {
    const provider = new WalletRPCProvider(this.wallet!);
    let result: any;
    let error: string;

    try {
      result = await provider.rawCall(method, args);
    } catch (e) {
      error = e.message;
    }

    chrome.tabs.query({active: true, currentWindow: true}, ([{ id: tabID }]) => {
      chrome.tabs.sendMessage(tabID!, { type: MESSAGE_TYPE.RPC_CALL_RETURN, id, result, error });
    });
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.SEND_TOKENS:
        this.sendTokens(request.receiverAddress, request.amount);
        break;
      case MESSAGE_TYPE.RPC_CALL:
        if (this.wallet) {
          this.callRpc(request.id, request.method, request.args);
          sendResponse(true);
        } else {
          sendResponse(false);
        }
        break;
      default:
        break;
    }
  }
}
