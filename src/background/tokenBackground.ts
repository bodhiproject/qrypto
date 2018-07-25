import { each, findIndex } from 'lodash';
import BN from 'bn.js';

import Background from '.';
import { MESSAGE_TYPE } from '../constants';
import QRCToken from '../models/QRCToken';
import qrc20TokenABI from '../contracts/qrc20TokenABI';
import mainnetTokenList from '../contracts/mainnetTokenList';
import testnetTokenList from '../contracts/testnetTokenList';

const INIT_VALUES = {
  tokens: undefined,
  getBalancesInterval: undefined,
};

export default class TokenBackground {
  private static GET_BALANCES_INTERVAL_MS: number = 60000;

  public tokens?: QRCToken[] = INIT_VALUES.tokens;

  private bg: Background;
  private getBalancesInterval?: number = INIT_VALUES.getBalancesInterval;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.bg.onInitFinished('token');
  }

  /*
  * Init the token list based on the environment.
  */
  public initTokenList = () => {
    if (this.tokens) {
      return;
    }

    if (this.bg.network.isMainNet) {
      this.tokens = mainnetTokenList;
    } else {
      this.tokens = testnetTokenList;
    }
  }

  /*
  * Starts polling for periodic info updates.
  */
  public startPolling = async () => {
    await this.getBalances();
    if (!this.getBalancesInterval) {
      this.getBalancesInterval = window.setInterval(() => {
        this.getBalances();
      }, TokenBackground.GET_BALANCES_INTERVAL_MS);
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
    const res = await this.bg.rpc.callContract(
      token.address,
      qrc20TokenABI,
      'balanceOf',
      [this.bg.wallet.wallet!.address],
    );

    let balance = res.executionResult.formattedOutput[0]; // Returns as a BN instance
    balance = balance.div(new BN(10 ** token.decimals)).toNumber(); // Convert to regular denomination

    // Upddate token balance in place
    const index = findIndex(this.tokens, { name: token.name, abbreviation: token.abbreviation });
    if (index !== -1) {
      this.tokens![index].balance = balance;
    }

    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.QRC_TOKEN_BALANCES_RETURN, tokens: this.tokens });
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_QRC_TOKEN_LIST:
        sendResponse(this.tokens);
        break;
      default:
        break;
    }
  }
}
