import { Wallet, Insight } from 'qtumjs-wallet';
import { observable, computed } from 'mobx';
import { find, isEmpty } from 'lodash';

import AppStore from './AppStore';
import Account from '../models/Account';

const INIT_VALUES = {
  loading: true,
  appSalt: undefined,
  passwordHash: undefined,
  info: undefined,
  accounts: [],
  testnetAccounts: [],
  mainnetAccounts: [],
  loggedInAccount: undefined,
  wallet: undefined,
};

export default class WalletStore {
  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
  }

  
}
