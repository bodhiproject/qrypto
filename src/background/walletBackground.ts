import scrypt from 'scryptsy';
import { Wallet, Insight } from 'qtumjs-wallet';
import { isEmpty, split } from 'lodash';
import axios from 'axios';

import Background from '.';
import { MESSAGE_TYPE, STORAGE } from '../constants';

const INIT_VALUES = {
  appSalt: undefined,
  passwordHash: undefined,
  wallet: undefined,
  info: undefined,
};

export default class WalletBackground {
  private static SCRYPT_PARAMS_PW: any = { N: 131072, r: 8, p: 1 };
  private static SCRYPT_PARAMS_PRIV_KEY: any = { N: 8192, r: 8, p: 1 };
  private static GET_INFO_INTERVAL_MS: number = 10000;
  private static GET_PRICE_INTERVAL_MS: number = 60000;

  public wallet?: Wallet = INIT_VALUES.wallet;
  public info?: Insight.IGetInfo = INIT_VALUES.info;
  public get qtumBalanceUSD(): string {
    if (this.qtumPriceUSD && this.info) {
      return (this.qtumPriceUSD * this.info.balance).toFixed(2);
    } else {
      return 'Loading';
    }
  }

  private bg: Background;
  private appSalt?: Uint8Array = INIT_VALUES.appSalt;
  private passwordHash?: string = INIT_VALUES.passwordHash;
  private getInfoInterval?: number = undefined;
  private getPriceInterval?: number = undefined;
  private qtumPriceUSD: number = 0;
  private get validPasswordHash(): string {
    if (!this.passwordHash) {
      throw Error('passwordHash should be defined');
    }
    return this.passwordHash!;
  }

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.handleMessage);
    chrome.storage.local.get([STORAGE.APP_SALT], ({ appSalt }: any) => {
      if (!isEmpty(appSalt)) {
        const array = split(appSalt, ',').map((str) => parseInt(str, 10));
        this.appSalt =  Uint8Array.from(array);
      }

      this.bg.onInitFinished('wallet');
    });
  }

  /*
  * Resets the wallet vars back to the initial state.
  */
  public resetWallet = () => {
    this.wallet = INIT_VALUES.wallet;
    this.info =  INIT_VALUES.info;
  }

  /*
  * Generates the one-time created appSalt (if necessary) used to encrypt the user password.
  */
  public generateAppSaltIfNecessary = () => {
    try {
      if (!this.appSalt) {
        const appSalt: Uint8Array = window.crypto.getRandomValues(new Uint8Array(16)) as Uint8Array;
        this.appSalt = appSalt;
        chrome.storage.local.set(
          { [STORAGE.APP_SALT]: appSalt.toString() },
          () => console.log('appSalt set'),
        );
      }
    } catch (err) {
      throw Error('Error generating appSalt');
    }
  }

  /*
  * Derives the password hash with the password input.
  * @return Undefined or error.
  */
  public derivePasswordHash = async (password: string): Promise<any> => {
    return new Promise((resolve: any, reject: any) => {
      setTimeout(() => {
        try {
          if (!this.appSalt) {
            throw Error('appSalt should not be empty');
          }

          const saltBuffer = Buffer.from(this.appSalt!);
          const { N, r, p } = WalletBackground.SCRYPT_PARAMS_PW;
          const derivedKey = scrypt(password, saltBuffer, N, r, p, 64);
          this.passwordHash = derivedKey.toString('hex');

          resolve();
        } catch (err) {
          reject(err);
        }
      }, 100);
    });
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
        this.validPasswordHash,
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
      this.validPasswordHash,
      WalletBackground.SCRYPT_PARAMS_PRIV_KEY,
    );
  }

  /*
  * Starts polling for periodic info updates.
  */
  public startPolling = async () => {
    await this.getWalletInfo();
    await this.getQtumPrice();

    this.getInfoInterval = window.setInterval(() => {
      this.getWalletInfo();
    }, WalletBackground.GET_INFO_INTERVAL_MS);
    this.getPriceInterval = window.setInterval(() => {
      this.getQtumPrice();
    }, WalletBackground.GET_PRICE_INTERVAL_MS);
  }

  /*
  * Stops polling for the periodic info updates.
  */
  public stopPolling = () => {
    if (this.getInfoInterval) {
      clearInterval(this.getInfoInterval);
      this.getInfoInterval = undefined;
    }
    if (this.getPriceInterval) {
      clearInterval(this.getPriceInterval);
      this.getPriceInterval = undefined;
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

  /*
  * Gets the current Qtum market price.
  */
  private getQtumPrice = async () => {
    try {
      const jsonObj = await axios.get('https://api.coinmarketcap.com/v2/ticker/1684/');
      this.qtumPriceUSD = jsonObj.data.data.quotes.USD.price;
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_QTUM_PRICE_RETURN, qtumBalanceUSD: this.qtumBalanceUSD });
    } catch (err) {
      console.log(err);
    }
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_WALLET_INFO:
        sendResponse(this.info);
        break;
      case MESSAGE_TYPE.GET_QTUM_BALANCE_USD:
        sendResponse(this.qtumBalanceUSD);
        break;
      case MESSAGE_TYPE.SEND_TOKENS:
        this.sendTokens(request.receiverAddress, request.amount);
        break;
      default:
        break;
    }
  }
}
