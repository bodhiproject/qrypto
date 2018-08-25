import scrypt from 'scryptsy';
import * as bip39 from "bip39"
import { HDNode, ECPair } from "bitcoinjs-lib"

onmessage = (e) => {
  try {
    if (e.data.type == "scrypt") {
      const password = e.data.password
      const salt = e.data.salt
      const saltBuffer = Buffer.from(salt);
      const { N, r, p } = e.data.scryptParams;
      const derivedKey = scrypt(password, saltBuffer, N, r, p, 64);
      postMessage({derivedKey});
    } else if (e.data.type == "fromMnemonic") {
      const { mnemonic, info } = e.data;
      const seedHex = bip39.mnemonicToSeedHex(mnemonic)
      const hdNode = HDNode.fromSeedHex(seedHex, info)
      const account = hdNode.deriveHardened(88).deriveHardened(0).deriveHardened(0)
      const keyPair = account.keyPair
      console.log("d.signum()", keyPair.d.signum())
      
      postMessage({ keyPair });
    }
    
  } catch (err) {
    postMessage({err});
  }
}
