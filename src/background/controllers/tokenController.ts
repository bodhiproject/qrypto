import { each, findIndex, isEmpty } from 'lodash';
import BN from 'bn.js';

import QryptoController from '.';
import IController from './iController';
import { MESSAGE_TYPE, STORAGE } from '../../constants';
import QRCToken from '../../models/QRCToken';
import qrc20TokenABI from '../../contracts/qrc20TokenABI';
import mainnetTokenList from '../../contracts/mainnetTokenList';
import testnetTokenList from '../../contracts/testnetTokenList';
import { IRPCRequestPayload } from '../../types';

const INIT_VALUES = {
  tokens: undefined,
  getBalancesInterval: undefined,
};

export default class TokenController extends IController {
  private static GET_BALANCES_INTERVAL_MS: number = 60000;

  public tokens?: QRCToken[] = INIT_VALUES.tokens;

  private getBalancesInterval?: number = INIT_VALUES.getBalancesInterval;

  constructor(main: QryptoController) {
    super('token', main);

    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.initFinished();
  }

  public resetTokenList = () => {
    this.tokens = INIT_VALUES.tokens;
  }

  /*
  * Init the token list based on the environment.
  */
  public initTokenList = () => {
    if (this.tokens) {
      return;
    }

    chrome.storage.local.get([this.chromeStorageAccountTokenListKey()], (res: any) => {
      if (!isEmpty(res)) {
        this.tokens = res[this.chromeStorageAccountTokenListKey()];
      } else if (this.main.network.isMainNet) {
        this.tokens = mainnetTokenList;
      } else {
        this.tokens = testnetTokenList;
      }
    });
  }

  /*
  * Starts polling for periodic info updates.
  */
  public startPolling = async () => {
    await this.getBalances();
    if (!this.getBalancesInterval) {
      this.getBalancesInterval = window.setInterval(() => {
        this.getBalances();
      }, TokenController.GET_BALANCES_INTERVAL_MS);
    }
  }

  /*
  * Stops polling for the periodic info updates.
  */
  public stopPolling = () => {
    if (this.getBalancesInterval) {
      clearInterval(this.getBalancesInterval);
      this.getBalancesInterval = undefined;
    }
  }

  /*
  * Fetch the tokens balances via RPC calls.
  */
  private getBalances = () => {
    each(this.tokens, async (token: QRCToken) => {
      await this.getQRCTokenBalance(token);
    });
  }

  /*
  * Makes an RPC call to the contract to get the token balance of this current wallet address.
  * @param token The QRCToken to get the balance of.
  */
  private getQRCTokenBalance = async (token: QRCToken) => {
    if (!this.main.account.loggedInAccount
      || !this.main.account.loggedInAccount.wallet
      || !this.main.account.loggedInAccount.wallet.qjsWallet
    ) {
      console.error('Cannot getQRCTokenBalance without wallet instance.');
      return;
    }

    const res = await this.main.rpc.callContract({
      contractAddress: token.address,
      abi: qrc20TokenABI,
      methodName: 'balanceOf',
      args: [this.main.account.loggedInAccount.wallet.qjsWallet.address],
    });

    let balance = res.executionResult.formattedOutput[0]; // Returns as a BN instance
    balance = balance.div(new BN(10 ** token.decimals)).toNumber(); // Convert to regular denomination

    // Update token balance in place
    const index = findIndex(this.tokens, { name: token.name, symbol: token.symbol });
    if (index !== -1) {
      this.tokens![index].balance = balance;
    }

    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.QRC_TOKENS_RETURN, tokens: this.tokens });
  }

  private getQRCTokenDetails = async (contractAddress: string) => {
    let msg;
    /*
    * Further contract address validation - if the addr provided does not have name,
    * symbol, and decimals fields, it will throw an error as it is not a valid
    * qrc20TokenContractAddr
    */
    try {
      const payload: IRPCRequestPayload = {
        contractAddress,
        abi: qrc20TokenABI,
        methodName: 'name',
        args: [],
      };

      let res = await this.main.rpc.callContract(
        payload,
      );
      const name = res.executionResult.formattedOutput[0];

      payload.methodName = 'symbol';
      res = await this.main.rpc.callContract(payload);
      const symbol = res.executionResult.formattedOutput[0];

      payload.methodName = 'decimals';
      res = await this.main.rpc.callContract(payload);
      const decimals = res.executionResult.formattedOutput[0];

      if (name && symbol && decimals) {
        const token = new QRCToken(name, symbol, decimals, contractAddress);
        msg = {
          type: MESSAGE_TYPE.QRC_TOKEN_DETAILS_RETURN,
          isValid: true,
          token,
        };
      } else {
        msg = {
          type: MESSAGE_TYPE.QRC_TOKEN_DETAILS_RETURN,
          isValid: false,
        };
      }
    } catch {
      msg = {
        type: MESSAGE_TYPE.QRC_TOKEN_DETAILS_RETURN,
        isValid: false,
      };
    }

    chrome.runtime.sendMessage(msg);
  }

  /*
  * Send QRC tokens.
  * @param receiverAddress The receiver of the send.
  * @param amount The amount to send in decimal format.
  * @param token The QRC token being sent.
  */
  private sendQRCToken = async (receiverAddress: string, amount: number, token: QRCToken) => {
    try {
      const bnAmount = new BN(amount).mul(new BN(10 ** token.decimals));
      await this.main.rpc.sendToContract({
        contractAddress: token.address,
        abi: qrc20TokenABI,
        methodName: 'transfer',
        args: [receiverAddress, bnAmount],
      });
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.SEND_TOKENS_SUCCESS });
    } catch (err) {
      console.log(err);
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.SEND_TOKENS_FAILURE, error: err });
    }
  }

  private addToken = async (contractAddress: string, name: string, symbol: string, decimals: number) => {
    const newToken = new QRCToken(name, symbol, decimals, contractAddress);
    this.tokens!.push(newToken);
    this.setTokenListInChromeStorage();
    await this.getQRCTokenBalance(newToken);
  }

  private removeToken = (contractAddress: string) => {
    const index = findIndex(this.tokens, { address: contractAddress });
    this.tokens!.splice(index, 1);
    this.setTokenListInChromeStorage();
  }

  private setTokenListInChromeStorage = () => {
    chrome.storage.local.set({
      [this.chromeStorageAccountTokenListKey()]: this.tokens,
    }, () => {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.QRC_TOKENS_RETURN,
        tokens: this.tokens,
      });
    });
  }

  private chromeStorageAccountTokenListKey = () => {
    return `${STORAGE.ACCOUNT_TOKEN_LIST}-${this.main.account.loggedInAccount!.name}-${this.main.network.networkName}`;
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_QRC_TOKEN_LIST:
        sendResponse(this.tokens);
        break;
      case MESSAGE_TYPE.SEND_QRC_TOKENS:
        this.sendQRCToken(request.receiverAddress, request.amount, request.token);
        break;
      case MESSAGE_TYPE.ADD_TOKEN:
        this.addToken(request.contractAddress, request.name, request.symbol, request.decimals);
        break;
      case MESSAGE_TYPE.GET_QRC_TOKEN_DETAILS:
        this.getQRCTokenDetails(request.contractAddress);
        break;
      case MESSAGE_TYPE.REMOVE_TOKEN:
        this.removeToken(request.contractAddress);
        break;
      default:
        break;
    }
  }
}
