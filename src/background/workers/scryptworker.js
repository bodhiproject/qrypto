import scrypt from 'scryptsy';

onmessage = (e) => {
  try {
    const password = e.data.password
    const salt = e.data.salt
    const saltBuffer = Buffer.from(salt);
    const { N, r, p } = e.data.scryptParams;
    const derivedKey = scrypt(password, saltBuffer, N, r, p, 64);
    const passwordHash = derivedKey.toString('hex');
    postMessage({ passwordHash });
  } catch (err) {
    postMessage({ err });
  }
}
