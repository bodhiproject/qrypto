import scrypt from 'scryptsy';

import { TARGET_NAME } from '../../constants';
import Config from '../../config';

const derivePasswordHash = (appSalt, password) => {
  const saltBuffer = Buffer.from(appSalt);
  const { N, r, p } = Config.SCRYPT_PARAMS.PASSWORD;
  const derivedKey = scrypt(password, saltBuffer, N, r, p, 64);

  const passwordHash = derivedKey.toString('hex');
  postMessage({
    passwordHash,
  }, TARGET_NAME.PASSWORD_HASH_WORKER);
};

self.addEventListener('message', (event) => {
  if (event.data.target === TARGET_NAME.PASSWORD_HASH_WORKER) {
    const { appSalt, password } = event.data;
    derivePasswordHash(appSalt, password);
  }
}, false);
