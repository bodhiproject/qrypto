[![Build Status](https://travis-ci.org/bodhiproject/qrypto.svg?branch=master)](https://travis-ci.org/bodhiproject/qrypto)

# Get Qrypto
Chome Web Store: https://chrome.google.com/webstore/detail/qrypto/hdmjdgjbehedbnjmljikggbmmbnbmlnd

# Connecting Qrypto to your Web Dapp
RPC calls can be directly made via our `QryptoProvider` which is injected into every webpage if you have Qrypto installed and running.

**Make sure that `qryptoProvider` is defined before using it.**

### Send To Contract
```
// sendtocontract
const contractAddress = '49a941c5259e4e6ef9ac4a2a6716c1717ce0ffb6';
const data = 'd0821b0e0000000000000000000000000000000000000000000000000000000000000001';
const qtumAmt = 1; // optional. defaults to 0.
const gasLimit = 200000; // optional. defaults to 200000.
const gasPrice = 40; // optional. defaults to 40 (satoshi).
window.qryptoProvider.rawCall(
  'sendToContract',
  [contractAddress, data, qtumAmt, gasLimit, gasPrice],
);

// Handle incoming messages
function handleMessage(message) {
  if (message.data.target == 'qrypto-inpage') {
    // result: object
    // error: string
    const { result, error } = message.data.message.payload;
    
    if (error) {
      if (error === 'Not logged in. Please log in to Qrypto first.') {
        // Show an alert dialog that the user needs to login first
        alert(error);
      } else {
        // Handle different error than not logged in...
      }
      return;
    }

    // Do something with the message result...
  }
}
window.addEventListener('message', handleMessage, false);
```

### Call Contract
```
// callcontract
const contractAddress = 'a6dd0b0399dc6162cedde85ed50c6fa4a0dd44f1';
const data = '06fdde03';
window.qryptoProvider.rawCall(
  'callContract',
  [contractAddress, data]
).then((res) => console.log(res));
```

# Running Dev Version
### Chrome
1. `yarn start` in the project folder to build the dev version and wait for it to be built
2. Open Chrome and load URL: `chrome://extensions`
3. Turn `Developer mode` on in the top right
4. At the top, click `Load Unpacked Extension`
5. Navigate to your `qrypto/dist` folder
6. Click `Select`. The extension should now be loaded
7. Click on the Qrypto logo in your Chrome extensions bar to open

# Security Flow
**First Time Flow**
1. `appSalt` is generated on a per-install basis
2. User enters `password` in Login page
3. `password` + `appSalt` runs through `scrpyt` encryption for ~3 seconds to generate `passwordHash`
4. User creates or imports wallet
5. `passwordHash` + wallet's `privateKey` runs through `scrypt` encryption for ~1 second to generate `encryptedPrivateKey`
6. Account is saved in storage with `encryptedPrivateKey`

**Return User Flow**
1. User enters password in Login page
2. `password` + `appSalt` runs through `scrpyt` encryption for ~3 seconds to generate `passwordHash`
3. Existing account is fetched from storage
4. `passwordHash` is used to decrypted the `encryptedPrivateKey`. On successful decryption of the wallet, the password is validated.
