import { Wallet, Insight } from 'qtumjs-wallet';

import Background from '.';
import { MESSAGE_TYPE } from '../constants';

const INIT_VALUES = {
  wallet: undefined,
  info: undefined,
  getInfoInterval: undefined,
};

export default class WalletBackground {
  private static SCRYPT_PARAMS_PRIV_KEY: any = { N: 8192, r: 8, p: 1 };
  private static GET_INFO_INTERVAL_MS: number = 10000;

  public wallet?: Wallet = INIT_VALUES.wallet;
  public info?: Insight.IGetInfo = INIT_VALUES.info;

  private bg: Background;
  private getInfoInterval?: number = INIT_VALUES.getInfoInterval;

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
  * Derives the private key hash with the password hash.
  * @return Private key hash or exception thrown.
  */
  public derivePrivateKeyHash = async (mnemonic: string): Promise<string> => {
    try {
      const network = this.bg.network.network;
      this.wallet = await network.fromMnemonic(mnemonic);
      const privateKeyHash = await this.wallet.toEncryptedPrivateKey(
        this.bg.crypto.validPasswordHash,
        WalletBackground.SCRYPT_PARAMS_PRIV_KEY,
      );
      return privateKeyHash;
    } catch (err) {
      throw err;
    }
  }

  /*
  * Recovers the wallet instance from an encrypted private key.
  * @param privateKeyHash The private key hash to recover the wallet from.
  */
  public async recoverWallet(privateKeyHash: string) {
    const network = this.bg.network.network;
    this.wallet = await network.fromEncryptedPrivateKey(
      privateKeyHash,
      this.bg.crypto.validPasswordHash,
      WalletBackground.SCRYPT_PARAMS_PRIV_KEY,
    );
  }

  /*
  * Starts polling for periodic info updates.
  */
  public startPolling = async () => {
    await this.getWalletInfo();
    if (!this.getInfoInterval) {
      this.getInfoInterval = window.setInterval(() => {
        this.getWalletInfo();
      }, WalletBackground.GET_INFO_INTERVAL_MS);
    }
  }

  /*
  * Stops polling for the periodic info updates.
  */
  public stopPolling = () => {
    if (this.getInfoInterval) {
      clearInterval(this.getInfoInterval);
      this.getInfoInterval = undefined;
    }
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

  /*
  * Fetches the wallet info from the current wallet instance.
  */
  private getWalletInfo = async () => {
    this.info = await this.wallet!.getInfo();
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_WALLET_INFO_RETURN, info: this.info });
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_WALLET_INFO:
        sendResponse(this.info);
        break;
      case MESSAGE_TYPE.SEND_TOKENS:
        this.sendTokens(request.receiverAddress, request.amount);
        break;
      default:
        break;
    }
  }
}
