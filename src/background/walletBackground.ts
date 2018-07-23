import scrypt from 'scryptsy';
import { networks, Network, Wallet, Insight } from 'qtumjs-wallet';
import { isEmpty, split, find } from 'lodash';
import axios from 'axios';

import { MESSAGE_TYPE, STORAGE, NETWORK_NAMES } from '../constants';
import Account from '../models/Account';
import QryNetwork from '../models/QryNetwork';

const INIT_VALUES = {
  appSalt: undefined,
  passwordHash: undefined,
  mainnetAccounts: [],
  testnetAccounts: [],
  loggedInAccount: undefined,
  wallet: undefined,
  info: undefined,
};

export default class WalletBackground {
  public static NETWORKS: QryNetwork[] = [
    new QryNetwork(NETWORK_NAMES.MAINNET, networks.mainnet),
    new QryNetwork(NETWORK_NAMES.TESTNET, networks.testnet),
  ];

  private static SCRYPT_PARAMS_PW: any = { N: 131072, r: 8, p: 1 };
  private static SCRYPT_PARAMS_PRIV_KEY: any = { N: 8192, r: 8, p: 1 };
  private static GET_INFO_INTERVAL_MS: number = 10000;
  private static GET_PRICE_INTERVAL_MS: number = 60000;

  public loggedInAccount?: Account = INIT_VALUES.loggedInAccount;
  public wallet?: Wallet = INIT_VALUES.wallet;
  public info?: Insight.IGetInfo = INIT_VALUES.info;

  private appSalt?: Uint8Array = INIT_VALUES.appSalt;
  private passwordHash?: string = INIT_VALUES.passwordHash;
  private mainnetAccounts: Account[] = INIT_VALUES.mainnetAccounts;
  private testnetAccounts: Account[] = INIT_VALUES.testnetAccounts;
  private networkIndex: number = 1;
  private getInfoInterval?: number = undefined;
  private getPriceInterval?: number = undefined;
  private qtumPriceUSD: number = 0;

  public get accounts(): Account[] {
    return this.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
  }

  public get hasAccounts(): boolean {
    return !isEmpty(this.mainnetAccounts) || !isEmpty(this.testnetAccounts);
  }

  public get isMainNet(): boolean {
    return this.networkIndex === 0;
  }

  public get qtumBalanceUSD(): string {
    if (this.qtumPriceUSD && this.info) {
      return (this.qtumPriceUSD * this.info.balance).toFixed(2);
    } else {
      return 'Loading';
    }
  }

  private get validPasswordHash(): string {
    if (!this.passwordHash) {
      throw Error('passwordHash should be defined');
    }
    return this.passwordHash!;
  }

  private get network(): Network  {
    return WalletBackground.NETWORKS[this.networkIndex].network;
  }

  constructor() {
    chrome.runtime.onMessage.addListener(this.handleMessage);

    // Initializes all the values from Chrome storage on startup
    const { APP_SALT, MAINNET_ACCOUNTS, TESTNET_ACCOUNTS, NETWORK_INDEX } = STORAGE;
    chrome.storage.local.get([APP_SALT, MAINNET_ACCOUNTS, TESTNET_ACCOUNTS, NETWORK_INDEX],
      ({ appSalt, mainnetAccounts, testnetAccounts, networkIndex }: any) => {
        if (!isEmpty(appSalt)) {
          const array = split(appSalt, ',').map((str) => parseInt(str, 10));
          this.appSalt =  Uint8Array.from(array);
        }

        if (!isEmpty(mainnetAccounts)) {
          this.mainnetAccounts = mainnetAccounts;
        }

        if (!isEmpty(testnetAccounts)) {
          this.testnetAccounts = testnetAccounts;
        }

        if (networkIndex !== undefined) {
          this.networkIndex = networkIndex;
        }

        // Show the Login page after fetching storage
        chrome.runtime.sendMessage({ type: MESSAGE_TYPE.ROUTE_LOGIN });
      });
  }

  public isWalletNameTaken = (name: string): boolean => {
    return !!find(this.accounts, { name });
  }

  public login = async (password: string) => {
    this.generateAppSaltIfNecessary();

    try {
      await this.derivePasswordHash(password);
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
  * @param accountName {string} The account name for the new wallet account.
  * @param mnemonic {string} The mnemonic to derive the wallet from.
  */
  public async addAccountAndLogin(accountName: string, mnemonic: string) {
    // Get encrypted private key
    const network = this.network;
    this.wallet = await network.fromMnemonic(mnemonic);
    const privateKeyHash = await this.wallet.toEncryptedPrivateKey(
      this.validPasswordHash,
      WalletBackground.SCRYPT_PARAMS_PRIV_KEY,
    );
    const account = new Account(accountName, privateKeyHash);

    // Add account if not existing
    if (this.isMainNet) {
      this.mainnetAccounts.push(account);
      chrome.storage.local.set({
        [STORAGE.MAINNET_ACCOUNTS]: this.mainnetAccounts,
      }, () => console.log('Mainnet Account added', account));
    } else {
      this.testnetAccounts.push(account);
      chrome.storage.local.set({
        [STORAGE.TESTNET_ACCOUNTS]: this.testnetAccounts,
      }, () => console.log('Testnet Account added', account));
    }

    this.loggedInAccount = account;
    await this.onAccountLoggedIn();
  }

  public importMnemonic = async (accountName: string, mnemonic: string) => {
    const isTaken = await this.isWalletMnemonicTaken(mnemonic);
    if (isTaken) {
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.IMPORT_MNEMONIC_FAILURE });
      return;
    }

    this.addAccountAndLogin(accountName, mnemonic);
  }

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
  public async loginAccount(accountName: string) {
    const accounts = this.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    const foundAccount = find(accounts, { name: accountName });

    if (!foundAccount) {
      throw Error('Account should not be undefined');
    }

    this.loggedInAccount = foundAccount;

    // Recover wallet
    const network = this.network;
    this.wallet = await network.fromEncryptedPrivateKey(
      this.loggedInAccount!.privateKeyHash,
      this.validPasswordHash,
      WalletBackground.SCRYPT_PARAMS_PRIV_KEY,
    );

    await this.onAccountLoggedIn();
  }

  public logout = () => {
    this.stopPolling();
    this.loggedInAccount = INIT_VALUES.loggedInAccount;
    this.wallet = INIT_VALUES.wallet;
    this.info =  INIT_VALUES.info;
    this.routeToAccountPage();
  }

  public changeNetwork = (networkIndex: number) => {
    if (this.networkIndex !== networkIndex) {
      this.networkIndex = networkIndex;
      chrome.storage.local.set({
        [STORAGE.NETWORK_INDEX]: networkIndex,
      }, () => console.log('networkIndex added to storage', networkIndex));

      this.logout();
    }
  }

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

  private generateAppSaltIfNecessary = () => {
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
  * @return Promise undefined or error.
  */
  private derivePasswordHash = async (password: string): Promise<any> => {
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
  * Routes to the CreateWallet or AccountLogin page after unlocking with the password.
  */
  private routeToAccountPage = () => {
    const accounts = this.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    if (isEmpty(accounts)) {
      // Account not found, route to Create Wallet page
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGIN_SUCCESS_NO_ACCOUNTS });
    } else {
      // Accounts found, route to Account Login page
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGIN_SUCCESS_WITH_ACCOUNTS });
    }
  }

  /*
  * Validates a password by decrypting a private key hash into a wallet instance.
  * @return Is the password valid.
  */
  private validatePassword = async (): Promise<boolean> => {
    let qryNetwork: QryNetwork;
    let account: Account;
    if (!isEmpty(this.mainnetAccounts)) {
      qryNetwork = WalletBackground.NETWORKS[0];
      account = this.mainnetAccounts[0];
    } else if (!isEmpty(this.testnetAccounts)) {
      qryNetwork = WalletBackground.NETWORKS[1];
      account = this.testnetAccounts[0];
    } else {
      throw Error('Trying to validate password without existing account');
    }

    try {
      await qryNetwork.network.fromEncryptedPrivateKey(
        account.privateKeyHash,
        this.validPasswordHash,
        WalletBackground.SCRYPT_PARAMS_PRIV_KEY,
      );
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  private isWalletMnemonicTaken = async (mnemonic: string): Promise<boolean> => {
    const wallet = await this.network.fromMnemonic(mnemonic);
    const privateKeyHash = await wallet.toEncryptedPrivateKey(
      this.validPasswordHash,
      WalletBackground.SCRYPT_PARAMS_PRIV_KEY,
    );
    const accounts = this.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    return !!find(accounts, { privateKeyHash });
  }

  private getQtumPrice = async () => {
    try {
      const jsonObj = await axios.get('https://api.coinmarketcap.com/v2/ticker/1684/');
      this.qtumPriceUSD = jsonObj.data.data.quotes.USD.price;
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_QTUM_PRICE_RETURN, qtumBalanceUSD: this.qtumBalanceUSD });
    } catch (err) {
      console.log(err);
    }
  }

  private getWalletInfo = async () => {
    this.info = await this.wallet!.getInfo();
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_WALLET_INFO_RETURN, info: this.info });
  }

  private startPolling = async () => {
    await this.getWalletInfo();
    await this.getQtumPrice();

    this.getInfoInterval = window.setInterval(() => {
      this.getWalletInfo();
    }, WalletBackground.GET_INFO_INTERVAL_MS);
    this.getPriceInterval = window.setInterval(() => {
      this.getQtumPrice();
    }, WalletBackground.GET_PRICE_INTERVAL_MS);
  }

  private stopPolling = () => {
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
  * Actions after adding a new account or logging into an existing account.
  */
  private onAccountLoggedIn = async () => {
    await this.startPolling();
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.ROUTE_HOME });
  }

  private handleMessage = (
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void,
  ) => {
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
      case MESSAGE_TYPE.LOGOUT:
        this.logout();
        break;
      case MESSAGE_TYPE.CHANGE_NETWORK:
        this.changeNetwork(request.networkIndex);
        break;
      case MESSAGE_TYPE.GET_NETWORKS:
        sendResponse(WalletBackground.NETWORKS);
        break;
      case MESSAGE_TYPE.IS_MAINNET:
        sendResponse(this.isMainNet);
        break;
      case MESSAGE_TYPE.HAS_ACCOUNTS:
        sendResponse(this.hasAccounts);
        break;
      case MESSAGE_TYPE.GET_ACCOUNTS:
        sendResponse(this.accounts);
        break;
      case MESSAGE_TYPE.GET_LOGGED_IN_ACCOUNT:
        sendResponse(this.loggedInAccount);
        break;
      case MESSAGE_TYPE.GET_WALLET_INFO:
        sendResponse(this.info);
        break;
      case MESSAGE_TYPE.GET_QTUM_BALANCE_USD:
        sendResponse(this.qtumBalanceUSD);
        break;
      case MESSAGE_TYPE.VALIDATE_WALLET_NAME:
        sendResponse(this.isWalletNameTaken(request.name));
        break;
      default:
        break;
    }
  }
}
