import scrypt from 'scryptsy';
import { networks, Network, Wallet, Insight } from 'qtumjs-wallet';
import { isEmpty, split, find } from 'lodash';
import axios from 'axios';

import { MESSAGE_TYPE, STORAGE, NETWORK_NAMES } from '../constants';
import Account from '../models/Account';
import QryNetwork from '../models/QryNetwork';

class Background {
  private static SCRYPT_PARAMS_PW: any = { N: 131072, r: 8, p: 1 };
  private static SCRYPT_PARAMS_PRIV_KEY: any = { N: 8192, r: 8, p: 1 };
  private static GET_INFO_INTERVAL_MS: number = 30000;
  private static GET_PRICE_INTERVAL_MS: number = 60000;
  private static NETWORKS: QryNetwork[] = [
    new QryNetwork(NETWORK_NAMES.MAINNET, networks.mainnet),
    new QryNetwork(NETWORK_NAMES.TESTNET, networks.testnet),
  ];

  private appSalt?: Uint8Array;
  private passwordHash?: string;
  private mainnetAccounts: Account[] = [];
  private testnetAccounts: Account[] = [];
  private networkIndex: number = 1;
  private wallet?: Wallet;
  private loggedInAccount?: Account;
  private getInfoInterval?: number = undefined;
  private getPriceInterval?: number = undefined;
  private info?: Insight.IGetInfo = undefined;
  private qtumPriceUSD: number = 0;

  public get hasAccounts(): boolean {
    return !isEmpty(this.mainnetAccounts) || !isEmpty(this.testnetAccounts);
  }

  public get isMainNet(): boolean {
    return this.networkIndex === 0;
  }

  private get validPasswordHash(): string {
    if (!this.passwordHash) {
      throw Error('passwordHash should be defined');
    }
    return this.passwordHash!;
  }

  private get network(): Network  {
    return Background.NETWORKS[this.networkIndex].network;
  }

  /*
  * Initializes all the values from Chrome storage on startup.
  */
  public fetchStorageValues = () => {
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

  public login = async (password: string) => {
    instance.generateAppSaltIfNecessary();

    try {
      await instance.derivePasswordHash(password);
    } catch (err) {
      throw err;
    }

    if (!instance.hasAccounts) {
      // New user. No created wallets yet. No need to validate.
      instance.routeToAccountPage();
      return;
    }

    const isPwValid = await instance.validatePassword();
    if (isPwValid) {
      instance.routeToAccountPage();
      return;
    }

    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGIN_FAILURE });
  }

  public importMnemonic = async (accountName: string, mnemonic: string) => {
    const isTaken = await instance.isWalletMnemonicTaken(mnemonic);
    if (isTaken) {
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.IMPORT_MNEMONIC_FAILURE });
      return;
    }

    this.addAccountAndLogin(accountName, mnemonic);
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
          const { N, r, p } = Background.SCRYPT_PARAMS_PW;
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
      qryNetwork = Background.NETWORKS[0];
      account = this.mainnetAccounts[0];
    } else if (!isEmpty(this.testnetAccounts)) {
      qryNetwork = Background.NETWORKS[1];
      account = this.testnetAccounts[0];
    } else {
      throw Error('Trying to validate password without existing account');
    }

    try {
      await qryNetwork.network.fromEncryptedPrivateKey(
        account.privateKeyHash,
        this.validPasswordHash,
        Background.SCRYPT_PARAMS_PRIV_KEY,
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
      Background.SCRYPT_PARAMS_PRIV_KEY,
    );
    const accounts = this.isMainNet ? this.mainnetAccounts : this.testnetAccounts;
    return !!find(accounts, { privateKeyHash });
  }

  private getQtumPrice = async () => {
    try {
      const jsonObj = await axios.get('https://api.coinmarketcap.com/v2/ticker/1684/');
      this.qtumPriceUSD = jsonObj.data.data.quotes.USD.price;
    } catch (err) {
      console.log(err);
    }
  }

  private getWalletInfo = async () => {
    this.info = await this.wallet!.getInfo();
  }

  private startPolling = async () => {
    await this.getWalletInfo();
    await this.getQtumPrice();

    this.getInfoInterval = window.setInterval(() => {
      this.getWalletInfo();
    }, Background.GET_INFO_INTERVAL_MS);
    this.getPriceInterval = window.setInterval(() => {
      this.getQtumPrice();
    }, Background.GET_PRICE_INTERVAL_MS);
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

  /*
  * Creates an account, stores it, and logs in.
  * @param accountName {string} The account name for the new wallet account.
  * @param mnemonic {string} The mnemonic to derive the wallet from.
  */
  private async addAccountAndLogin(accountName: string, mnemonic: string) {
    // Get encrypted private key
    const network = this.network;
    this.wallet = await network.fromMnemonic(mnemonic);
    const privateKeyHash = await this.wallet.toEncryptedPrivateKey(
      this.validPasswordHash,
      Background.SCRYPT_PARAMS_PRIV_KEY,
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
}

const instance = new Background();
instance.fetchStorageValues();

const onMessage = (request: any, sender: chrome.runtime.MessageSender) => {
  console.log('request', request);
  console.log('sender', sender);

  switch (request.type) {
    case MESSAGE_TYPE.LOGIN:
      instance.login(request.password);
      break;

    case MESSAGE_TYPE.IMPORT_MNEMONIC:
      const { accountName, mnemonic } = request;
      instance.importMnemonic(accountName, mnemonic);
      break;

    default:
      break;
  }
};

chrome.runtime.onMessage.addListener(onMessage);
