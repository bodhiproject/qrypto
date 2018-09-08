const dedent = require('dedent-js');

import { postWindowMessage } from '../utils/messenger';
import { TARGET_NAME, API_TYPE } from '../constants';

const INIT_VALUES = {
  accountIsLoggedIn: false,
  name: '',
  network: '',
  address: '',
  balance: 0,
};

export class QryptoAccount {
  public accountIsLoggedIn: boolean = INIT_VALUES.accountIsLoggedIn;
  public name: string = INIT_VALUES.name;
  public network: string = INIT_VALUES.network;
  public address: string = INIT_VALUES.address;
  public balance: number = INIT_VALUES.balance;

  constructor() {
    postWindowMessage(TARGET_NAME.CONTENTSCRIPT, {
      type: API_TYPE.GET_INPAGE_QRYPTO_ACCOUNT_VALUES_1,
      payload: {},
    });
  }

  /* This method gives a tie in to the dapp, so that it can be notified
  when a user logs in or out of qrypto. The dapp overwrites this method.
  */
  public statusChanged() {
    const text = dedent`window.qryptoAccount has changed.
    Overwrite the function window.qryptoAccount.statusChanged to make this notification interact with your dapp.
    Ex: window.qryptoAccount.statusChanged = function () { console.log('<running dapp code...>') }`;
    console.log(text);
  }

  public setQryptoAccountValues(payload: any) {
    if (payload.accountIsLoggedIn !== this.accountIsLoggedIn) {
      this.statusChanged();
    }

    if (payload.accountIsLoggedIn) {
      this.accountIsLoggedIn = payload.accountIsLoggedIn;
      this.name = payload.name;
      this.network = payload.network;
      this.address = payload.address;
      this.balance = payload.balance;
    } else {
      this.setToInitValues();
    }
  }

  private setToInitValues() {
    this.accountIsLoggedIn = INIT_VALUES.accountIsLoggedIn;
    this.name = INIT_VALUES.name;
    this.network = INIT_VALUES.network;
    this.address = INIT_VALUES.address;
    this.balance = INIT_VALUES.balance;
  }
}
