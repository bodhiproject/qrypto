import { WalletRPCProvider } from 'qtumjs-wallet';

import Background from '.';

export default class RPCBackground {
  private bg: Background;
  private rpcProvider?: WalletRPCProvider;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.onMessage);
  }

  public createRpcProvider = () => {
    const wallet = this.bg.wallet.wallet;
    if (wallet) {
      this.rpcProvider = new WalletRPCProvider(wallet);
    }
  }

  public getBlockCount = () => {
    if (this.rpcProvider) {
      this.rpcProvider.rawCall()
    }
  }

  private onMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      default:
        break;
    }
  }
}
