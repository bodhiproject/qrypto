import scrypt from 'scryptsy';
import { networks } from 'qtumjs-wallet';
import { isEmpty, split } from 'lodash';

import { MESSAGE_TYPE, STORAGE, NETWORK_NAMES } from '../constants';
import Account from '../models/Account';
import QryNetwork from '../models/QryNetwork';

class Background {
  private static SCRYPT_PARAMS_PW: any = { N: 131072, r: 8, p: 1 };
  private static SCRYPT_PARAMS_PRIV_KEY: any = { N: 8192, r: 8, p: 1 };
  private static NETWORKS: QryNetwork[] = [
    new QryNetwork(NETWORK_NAMES.MAINNET, networks.mainnet),
    new QryNetwork(NETWORK_NAMES.TESTNET, networks.testnet),
  ];

  private appSalt?: Uint8Array;
  private passwordHash?: string;
  private mainnetAccounts: Account[] = [];
  private testnetAccounts: Account[] = [];
  private networkIndex: number = 1;

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

  public generateAppSaltIfNecessary = () => {
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
  public derivePasswordHash = async (password: string): Promise<any> => {
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
  public routeToAccountPage = () => {
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
  public validatePassword = async (): Promise<boolean> => {
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
}
const instance = new Background();
instance.fetchStorageValues();

const handleLogin = async ({ password }: any) => {
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
};

const onMessage = (request: any, sender: chrome.runtime.MessageSender) => {
  console.log('request', request);
  console.log('sender', sender);

  switch (request.type) {
    case MESSAGE_TYPE.LOGIN:
      handleLogin(request);
      break;

    default:
      break;
  }
};

chrome.runtime.onMessage.addListener(onMessage);
