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
  @observable public loading = INIT_VALUES.loading;
  @observable public appSalt?: Uint8Array = INIT_VALUES.appSalt;
  @observable public passwordHash?: string = INIT_VALUES.passwordHash;
  @observable public info?: Insight.IGetInfo = INIT_VALUES.info;
  @observable public testnetAccounts: Account[] = INIT_VALUES.testnetAccounts;
  @observable public mainnetAccounts: Account[] = INIT_VALUES.mainnetAccounts;
  @observable public loggedInAccount?: Account = INIT_VALUES.loggedInAccount;
  @observable public qtumPriceUSD = 0;
  @computed public get hasAccounts(): boolean {
    return !isEmpty(this.mainnetAccounts) || !isEmpty(this.testnetAccounts);
  }
  @computed public get accounts(): Account[] {
    return this.app.networkStore.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
  }
  @computed public get balanceUSD(): string {
    if (this.qtumPriceUSD && this.info) {
      return (this.qtumPriceUSD * this.info.balance).toFixed(2);
    } else {
      return 'Loading';
    }
  }
  public wallet?: Wallet = INIT_VALUES.wallet;

  private app: AppStore;

  constructor(app: AppStore) {
    this.app = app;
  }

  public isWalletNameTaken = (name: string): boolean => {
    const accounts = this.app.networkStore.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    return !!find(accounts, { name });
  }
}
