import scrypt from 'scryptsy';

import { TARGET_NAME } from '../../constants';

const derivePasswordHash = async (appSalt: string, password: string): Promise<any> => {
  const saltBuffer = Buffer.from(appSalt);
  const { N, r, p } = CryptoController.SCRYPT_PARAMS_PW;
  const derivedKey = scrypt(password, saltBuffer, N, r, p, 64);

  const passwordHash = derivedKey.toString('hex');
  postMessage({

  }, TARGET_NAME.DERIVE_PW_HASH_WORKER);
};

self.addEventListener('message', (event) => {
  const { appSalt, password } = event.data;
  derivePasswordHash(appSalt, password);
}, false);
