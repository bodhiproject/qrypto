import { observable, action, reaction } from 'mobx';
import { isEmpty } from 'lodash';

import AppStore from './AppStore';
import { MESSAGE_TYPE } from '../../constants';
import Account from '../../models/Account';

const INIT_VALUES = {
  selectedWalletName: '',
};

export default class AccountLoginStore {
  @observable public selectedWalletName: string = INIT_VALUES.selectedWalletName;
  @observable public accounts: Account[] = [];

  private app: AppStore;
  private selectedWalletNetworkIndex: number;

  constructor(app: AppStore) {
    this.app = app;
    this.selectedWalletNetworkIndex = this.app.sessionStore.networkIndex;

    // Set the default selected account on the login page.
    reaction(
      () => this.app.sessionStore.networkIndex,
      () => this.getAccounts(),
    );
  }

  /** @params andValidateNetwork: when set to true, disallows being on a network without
   * accounts. This is desirable on the accountLogin page as it ensures a valid state
   * where the displayed accounts matches the network. This is not desirable when
   * creating the first account for a network.
   */
  @action
  public getAccounts = (andValidateNetwork: boolean = false) => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_ACCOUNTS }, (response: any) => {
      if (!isEmpty(response)) {
        this.accounts = response;
        this.setSelectedWallet();
      } else {
        if (andValidateNetwork) {
          this.validateNetwork();
        }
      }
    });
  }

  /**
   * In some rare instances, the user can navigate to the AccountLogin page while on a
   * network that does not have accounts.
   * Ex: Import testnet wallet
   *    -> on AccountLogin page switch to mainnet (must do this without having imported a mainnet acct)
   *    -> takes you to the CreateWallet page
   *    -> navigate back to AccountLogin page
   * Without the validateNetwork method below this would show the testnet accounts even
   * though we are on mainnet, and is an invalid application state so we resolve it by
   * changing the network to that of the selectedWallet.
   */
  public validateNetwork = () => {
    if (this.app.sessionStore.networkIndex !== this.selectedWalletNetworkIndex) {
      this.app.navBarStore.changeNetwork(this.selectedWalletNetworkIndex);
    }
  }

  @action
  public setSelectedWallet = () => {
    if (!isEmpty(this.accounts)) {
      this.selectedWalletName = this.accounts[0].name;
      this.selectedWalletNetworkIndex = this.app.sessionStore.networkIndex;
    }
  }

  @action
  public loginAccount = () => {
    this.app.routerStore.push('/loading');
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPE.ACCOUNT_LOGIN,
      selectedWalletName: this.selectedWalletName,
    });
  }

  @action
  public routeToCreateWallet = () => {
    this.app.routerStore.push('/create-wallet');
  }

  @action
  public reset = () => Object.assign(this, INIT_VALUES)
}
