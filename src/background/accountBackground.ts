import { isEmpty, find, cloneDeep } from 'lodash';
import { Wallet as QtumWallet } from 'qtumjs-wallet';

import Background from '.';
import { MESSAGE_TYPE, STORAGE } from '../constants';
import Account from '../models/Account';
import Wallet from '../models/Wallet';

const INIT_VALUES = {
  mainnetAccounts: [],
  testnetAccounts: [],
  loggedInAccount: undefined,
  getInfoInterval: undefined,
};

export default class AccountBackground {
  private static SCRYPT_PARAMS_PRIV_KEY: any = { N: 8192, r: 8, p: 1 };
  private static GET_INFO_INTERVAL_MS: number = 30000;

  public get accounts(): Account[] {
    return this.bg.network.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
  }
  public get hasAccounts(): boolean {
    return !isEmpty(this.mainnetAccounts) || !isEmpty(this.testnetAccounts);
  }
  public loggedInAccount?: Account = INIT_VALUES.loggedInAccount;

  private bg: Background;
  private mainnetAccounts: Account[] = INIT_VALUES.mainnetAccounts;
  private testnetAccounts: Account[] = INIT_VALUES.testnetAccounts;
  private getInfoInterval?: number = INIT_VALUES.getInfoInterval;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.handleMessage);

    const { MAINNET_ACCOUNTS, TESTNET_ACCOUNTS } = STORAGE;
    chrome.storage.local.get([MAINNET_ACCOUNTS, TESTNET_ACCOUNTS], ({ mainnetAccounts, testnetAccounts }: any) => {
      if (!isEmpty(mainnetAccounts)) {
        this.mainnetAccounts = mainnetAccounts;
      }

      if (!isEmpty(testnetAccounts)) {
        this.testnetAccounts = testnetAccounts;
      }

      this.bg.onInitFinished('account');
    });
  }

  /*
  * Checks if the wallet name has been taken by another account.
  * @param name The wallet name to check.
  * @return If the wallet name has been already taken.
  */
  public isWalletNameTaken = (name: string): boolean => {
    return !!find(this.accounts, { name });
  }

  /*
  * Resets the account vars back to initial state.
  */
  public resetAccount = () => {
    console.log('resetAccount()');
    this.loggedInAccount = INIT_VALUES.loggedInAccount;
  }

  /*
  * Initial login with the master password and routing to the correct account login page.
  */
  public login = async (password: string) => {
    this.bg.crypto.generateAppSaltIfNecessary();

    try {
      await this.bg.crypto.derivePasswordHash(password);
    } catch (err) {
      throw err;
    }

    if (!this.hasAccounts) {
      // New user. No created wallets yet. No need to validate.
      this.routeToAccountPage();
      return;
    }

    const isPwValid = await this.validatePassword();
    if (isPwValid) {
      this.routeToAccountPage();
      return;
    }

    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGIN_FAILURE });
  }

  /*
  * Creates an account, stores it, and logs in.
  * @param accountName The account name for the new wallet account.
  * @param mnemonic The mnemonic to derive the wallet from.
  */
  public addAccountAndLogin = async (accountName: string, mnemonic: string) => {
    const walletObj = await this.recoverFromMnemonic(mnemonic);
    this.loggedInAccount = new Account(accountName, walletObj.privateKeyHash);
    this.loggedInAccount.wallet = new Wallet(walletObj.wallet);

    this.storeNewAccount(this.loggedInAccount);
    await this.onAccountLoggedIn();
  }

  /*
  * Imports a new wallet from mnemonic.
  * @param accountName The account name for the new wallet account.
  * @param mnemonic The mnemonic to derive the wallet from.
  */
  public importMnemonic = async (accountName: string, mnemonic: string) => {
    const isTaken = await this.isWalletMnemonicTaken(mnemonic);
    if (isTaken) {
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.IMPORT_MNEMONIC_FAILURE });
      return;
    }

    await this.addAccountAndLogin(accountName, mnemonic);
  }

  /*
  * Saves the generated mnemonic to a file and creates a new account.
  * @param accountName The account name for the new wallet account.
  * @param mnemonic The mnemonic to derive the wallet from.
  */
  public saveToFile = (accountName: string, mnemonic: string) => {
    const timestamp = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const file = new Blob([mnemonic], {type: 'text/plain'});
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = `qrypto_${accountName}_${timestamp}.bak`;
    element.click();

    this.addAccountAndLogin(accountName, mnemonic);
  }

  /*
  * Finds the account based on the name and logs in.
  * @param accountName {string} The account name to search by.
  */
  public loginAccount = async (accountName: string) => {
    const accounts = this.bg.network.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    this.loggedInAccount = find(accounts, { name: accountName });

    if (!this.loggedInAccount) {
      throw Error('Account should not be undefined');
    }

    try {
      const wallet = this.recoverFromPrivateKeyHash(this.loggedInAccount.privateKeyHash);
      this.loggedInAccount.wallet = new Wallet(wallet);

      await this.onAccountLoggedIn();
    } catch (err) {
      console.error(err);
      this.loggedInAccount = INIT_VALUES.loggedInAccount;
    }
  }

  /*
  * Logs out of the current account and routes back to the account login.
  */
  public logoutAccount = () => {
    this.bg.session.clearAllIntervals();
    this.bg.session.clearSession();
    this.routeToAccountPage();
  }

  /*
  * Routes to the CreateWallet or AccountLogin page after unlocking with the password.
  */
  public routeToAccountPage = () => {
    const accounts = this.bg.network.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    if (isEmpty(accounts)) {
      // Account not found, route to Create Wallet page
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGIN_SUCCESS_NO_ACCOUNTS });
    } else {
      // Accounts found, route to Account Login page
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGIN_SUCCESS_WITH_ACCOUNTS });
    }
  }

  /*
  * Actions after adding a new account or logging into an existing account.
  */
  public onAccountLoggedIn = async () => {
    this.bg.token.initTokenList();
    this.bg.rpc.createRpcProvider();
    await this.startPolling();
    await this.bg.token.startPolling();
    await this.bg.external.startPolling();
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.ACCOUNT_LOGIN_SUCCESS });
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
  * Recovers the wallet from mnemonic.
  * @return Private key hash and wallet instance or exception thrown.
  */
  private recoverFromMnemonic = async (mnemonic: string): Promise<any> => {
    return new Promise<any>((resolve, reject) => {
      try {
        const network = this.bg.network.network;
        const wallet = network.fromMnemonic(mnemonic);
        const privateKeyHash = wallet.toEncryptedPrivateKey(
          this.bg.crypto.validPasswordHash,
          AccountBackground.SCRYPT_PARAMS_PRIV_KEY,
        );
        resolve({ privateKeyHash, wallet });
      } catch (e) {
        reject(e);
      }
    });
  }

  /*
  * Recovers the wallet instance from an encrypted private key.
  * @param privateKeyHash The private key hash to recover the wallet from.
  */
  private recoverFromPrivateKeyHash(privateKeyHash: string): QtumWallet {
    const network = this.bg.network.network;
    return network.fromEncryptedPrivateKey(
      privateKeyHash,
      this.bg.crypto.validPasswordHash,
      AccountBackground.SCRYPT_PARAMS_PRIV_KEY,
    );
  }

  /*
  * Validates a password by decrypting a private key hash into a wallet instance.
  * @return Is the password valid.
  */
  private validatePassword = async (): Promise<boolean> => {
    let account: Account;
    if (!isEmpty(this.mainnetAccounts)) {
      account = this.mainnetAccounts[0];
    } else if (!isEmpty(this.testnetAccounts)) {
      account = this.testnetAccounts[0];
    } else {
      throw Error('Trying to validate password without existing account');
    }

    try {
      this.recoverFromPrivateKeyHash(account.privateKeyHash);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /*
  * Checks if a wallet mnemonic has already been taken.
  * @param mnemonic The wallet mnemonic to check.
  * @return Has the mnemonic been used.
  */
  private isWalletMnemonicTaken = async (mnemonic: string): Promise<boolean> => {
    const privateKeyHash = (await this.recoverFromMnemonic(mnemonic)).privateKeyHash;
    const accounts = this.bg.network.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    return !!find(accounts, { privateKeyHash });
  }

  private storeNewAccount = (account: Account) => {
    const prunedAcct = cloneDeep(account);
    Object.assign(prunedAcct, { wallet: undefined });

    // Add account if not existing
    if (this.bg.network.isMainNet) {
      this.mainnetAccounts.push(prunedAcct);
      chrome.storage.local.set({
        [STORAGE.MAINNET_ACCOUNTS]: this.mainnetAccounts,
      }, () => console.log('Mainnet Account added', prunedAcct));
    } else {
      this.testnetAccounts.push(prunedAcct);
      chrome.storage.local.set({
        [STORAGE.TESTNET_ACCOUNTS]: this.testnetAccounts,
      }, () => console.log('Testnet Account added', prunedAcct));
    }
  }

  /*
  * Fetches the wallet info from the current wallet instance.
  */
  private getWalletInfo = async () => {
    if (!this.loggedInAccount || !this.loggedInAccount.wallet || !this.loggedInAccount.wallet.qjsWallet) {
      console.error('Could not get wallet info.');
      return;
    }

    await this.loggedInAccount.wallet.getInfo();
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_WALLET_INFO_RETURN, info: this.loggedInAccount.wallet.info });
  }

  /*
  * Starts polling for periodic info updates.
  */
  private startPolling = async () => {
    await this.getWalletInfo();
    if (!this.getInfoInterval) {
      this.getInfoInterval = window.setInterval(() => {
        this.getWalletInfo();
      }, AccountBackground.GET_INFO_INTERVAL_MS);
    }
  }

  /*
  * Executes a sendtoaddress.
  * @param receiverAddress The address to send Qtum to.
  * @param amount The amount to send.
  */
  private sendTokens = async (receiverAddress: string, amount: number) => {
    if (!this.loggedInAccount || !this.loggedInAccount.wallet || !this.loggedInAccount.wallet.qjsWallet) {
      throw Error('Cannot send with no wallet instance.');
    }

    try {
      this.loggedInAccount.wallet.send(receiverAddress, amount);
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.SEND_TOKENS_SUCCESS });
    } catch (err) {
      console.log(err);
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.SEND_TOKENS_FAILURE, error: err });
    }
  }

  private handleMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.LOGIN:
        this.login(request.password);
        break;
      case MESSAGE_TYPE.IMPORT_MNEMONIC:
        this.importMnemonic(request.accountName, request.mnemonic);
        break;
      case MESSAGE_TYPE.CREATE_WALLET:
        this.addAccountAndLogin(request.accountName, request.mnemonic);
        break;
      case MESSAGE_TYPE.SAVE_TO_FILE:
        this.saveToFile(request.accountName, request.mnemonic);
        break;
      case MESSAGE_TYPE.ACCOUNT_LOGIN:
        this.loginAccount(request.selectedWalletName);
        break;
      case MESSAGE_TYPE.SEND_TOKENS:
        this.sendTokens(request.receiverAddress, request.amount);
        break;
      case MESSAGE_TYPE.LOGOUT:
        this.logoutAccount();
        break;
      case MESSAGE_TYPE.HAS_ACCOUNTS:
        sendResponse(this.hasAccounts);
        break;
      case MESSAGE_TYPE.GET_ACCOUNTS:
        sendResponse(this.accounts);
        break;
      case MESSAGE_TYPE.GET_LOGGED_IN_ACCOUNT_NAME:
        sendResponse(this.loggedInAccount ? this.loggedInAccount.name : undefined);
        break;
      case MESSAGE_TYPE.GET_WALLET_INFO:
        sendResponse(this.loggedInAccount && this.loggedInAccount.wallet
          ? this.loggedInAccount.wallet.info : undefined);
        break;
      case MESSAGE_TYPE.GET_QTUM_USD:
        sendResponse(this.loggedInAccount && this.loggedInAccount.wallet
          ? this.loggedInAccount.wallet.qtumUSD : undefined);
        break;
      case MESSAGE_TYPE.VALIDATE_WALLET_NAME:
        sendResponse(this.isWalletNameTaken(request.name));
        break;
      default:
        break;
    }
  }
}
