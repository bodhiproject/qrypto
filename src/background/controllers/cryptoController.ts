import { isEmpty, split } from 'lodash';

import QryptoController from '.';
import IController from './iController';
import { STORAGE } from '../../constants';

const INIT_VALUES = {
  appSalt: undefined,
  passwordHash: undefined,
};

export default class CryptoController extends IController {
  private static SCRYPT_PARAMS_PW: any = { N: 131072, r: 8, p: 1 };

  public get validPasswordHash(): string {
    if (!this.passwordHash) {
      throw Error('passwordHash should be defined');
    }
    return this.passwordHash!;
  }

  private appSalt?: Uint8Array = INIT_VALUES.appSalt;
  private passwordHash?: string = INIT_VALUES.passwordHash;

  constructor(main: QryptoController) {
    super('crypto', main);

    chrome.storage.local.get([STORAGE.APP_SALT], ({ appSalt }: any) => {
      if (!isEmpty(appSalt)) {
        const array = split(appSalt, ',').map((str) => parseInt(str, 10));
        this.appSalt =  Uint8Array.from(array);
      }

      this.initFinished();
    });
  }

  public hasValidPasswordHash(): boolean {
    return !!this.passwordHash;
  }

  public resetPasswordHash = () => {
    this.passwordHash = INIT_VALUES.passwordHash;
  }

  /*
  * Generates the one-time created appSalt (if necessary) used to encrypt the user password.
  */
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
  */
  public derivePasswordHash = (password: string) => {
    if (!this.appSalt) {
      throw Error('appSalt should not be empty');
    }

    /*
    * Create a web worker for the scrypt key derivation, so that it doesn't freeze the loading screen ui.
    * File path relative to post bundling of webpack. worker-loader node module did not work for me,
    * possibly a compatibility issue with chrome.
    */
    let sww;
    if (typeof(sww) === 'undefined') {
      sww = new Worker('./scryptworker.js');

      sww.postMessage({
        password,
        salt: this.appSalt,
        scryptParams: CryptoController.SCRYPT_PARAMS_PW,
      });

      sww.onmessage = (e) => {
        if (e.data.err) {
          throw Error('scrypt failed to calculate derivedKey');
        }
        const derivedKey = e.data.derivedKey;
        this.passwordHash = derivedKey.toString('hex');
        this.main.account.finishLogin();
      };
    }
  }
}
