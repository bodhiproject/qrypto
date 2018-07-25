import scrypt from 'scryptsy';
import { isEmpty, split } from 'lodash';

import Background from '.';
import { STORAGE } from '../constants';

const INIT_VALUES = {
  appSalt: undefined,
  passwordHash: undefined,
};

export default class CryptoBackground {
  private static SCRYPT_PARAMS_PW: any = { N: 131072, r: 8, p: 1 };

  public get validPasswordHash(): string {
    if (!this.passwordHash) {
      throw Error('passwordHash should be defined');
    }
    return this.passwordHash!;
  }

  private bg: Background;
  private appSalt?: Uint8Array = INIT_VALUES.appSalt;
  private passwordHash?: string = INIT_VALUES.passwordHash;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.storage.local.get([STORAGE.APP_SALT], ({ appSalt }: any) => {
      if (!isEmpty(appSalt)) {
        const array = split(appSalt, ',').map((str) => parseInt(str, 10));
        this.appSalt =  Uint8Array.from(array);
      }

      this.bg.onInitFinished('crypto');
    });
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
  * @return Undefined or error.
  */
  public derivePasswordHash = async (password: string): Promise<any> => {
    return new Promise((resolve: any, reject: any) => {
      setTimeout(() => {
        try {
          if (!this.appSalt) {
            throw Error('appSalt should not be empty');
          }

          const saltBuffer = Buffer.from(this.appSalt!);
          const { N, r, p } = CryptoBackground.SCRYPT_PARAMS_PW;
          const derivedKey = scrypt(password, saltBuffer, N, r, p, 64);
          this.passwordHash = derivedKey.toString('hex');

          resolve();
        } catch (err) {
          reject(err);
        }
      }, 100);
    });
  }
}
