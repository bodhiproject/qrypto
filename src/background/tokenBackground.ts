import { each } from 'lodash';

import Background from '.';
import { MESSAGE_TYPE } from '../constants';
import QRCToken from '../models/QRCToken';
import qrc20TokenABI from '../contracts/qrc20TokenABI';
import mainnetTokenList from '../contracts/mainnetTokenList';
import testnetTokenList from '../contracts/testnetTokenList';

const INIT_VALUES = {
  tokens: undefined,
};

export default class TokenBackground {
  public tokens?: QRCToken[] = INIT_VALUES.tokens;

  private bg: Background;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.handleMessage);
    this.bg.onInitFinished('token');
  }

  /*
  * Fetch the tokens balances via RPC calls.
  */
  public getBalances = () => {
    each(this.tokens, async (token: QRCToken) => {
      await this.getQRCTokenBalance(token);
    });
  }

  private setTokenList = () => {
    if (this.tokens) {
      return;
    }

    if (this.bg.network.isMainNet) {
      this.tokens = mainnetTokenList;
    } else {
      this.tokens = testnetTokenList;
    }
  }

  private getQRCTokenBalance = async (token: QRCToken) => {
    const res = await this.bg.rpc.callContract(
      token.address,
      qrc20TokenABI,
      'balanceOf',
      [this.bg.wallet.wallet!.address],
    );
    token.balance = res.executionResult.formattedOutput[0].toNumber();
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_QRC_TOKEN_BALANCES_RETURN, token });
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_QRC_TOKEN_LIST:
        this.setTokenList();
        sendResponse(this.tokens);
        break;
      case MESSAGE_TYPE.GET_QRC_TOKEN_BALANCES:
        this.getBalances();
        break;
      default:
        break;
    }
  }
}
