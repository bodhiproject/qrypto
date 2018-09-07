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

  public setQryptoAccountValues(payload: any) {
    this.accountIsLoggedIn = payload.accountIsLoggedIn;
    if (this.accountIsLoggedIn) {
      this.address = payload.address;
      this.balance = payload.balance;
      this.name = payload.name;
      this.network = payload.network;
    }
  }
}
