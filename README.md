[![Build Status](https://travis-ci.org/bodhiproject/qrypto.svg?branch=master)](https://travis-ci.org/bodhiproject/qrypto)

## Get Qrypto
Chome Web Store: https://chrome.google.com/webstore/detail/qrypto/hdmjdgjbehedbnjmljikggbmmbnbmlnd

## Connecting Qrypto to your Web Dapp
Connect to qrypto by calling 
window.postMessage({ message: { type: 'CONNECT_QRYPTO' }}, '*')

This will populate the window.qrypto.account object in your webpage.

RPC calls can be directly made via `QryptoProvider` which is injected into every webpage if you have Qrypto installed and running.

**Make sure that `window.qrypto.rpcProvider` is defined before using it.**

### Using QryptoProvider
```
// callcontract
const contractAddress = 'a6dd0b0399dc6162cedde85ed50c6fa4a0dd44f1';
const data = '06fdde03';
window.qrypto.rpcProvider.rawCall(
  'callContract',
  [contractAddress, data]
).then((res) => console.log(res));

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

### Qrypto User Account Status - Login/Logout
After connecting qrypto to your dapp, you can use an event listener to get notified when a user has logged in or out of Qrypto.

function qryptoAcctChanged(event){
  if (event.data.message && event.data.message.type == "ACCOUNT_CHANGED" && !event.data.message.payload.error) {
    console.log("account:", event.data.message.payload.account)
    // account: InpageAccount { loggedIn: true, name: "2", network: "TestNet", address: "qJHp6dUSmDShpEEMmwxqHPo7sFSdydSkPM", balance: 49.10998413 }
  }
}
window.addEventListener('message', qryptoAcctChanged, false);

You can also access the account details from window.qrypto.account
// InpageAccount { loggedIn: true, name: "myAcct", network: "TestNet", address: "qJHp6dUSmDShpEEMmwxqHPo7sFSdydSkPM", balance: 49.10998413 }

### Using Qweb3
You may also use our Qweb3 convenience library to make `sendtocontract` or `callcontract` calls. See the instructions in the Github repo here: https://github.com/bodhiproject/qweb3.js

## Running Dev Version
### Chrome
1. `yarn start` in the project folder to build the dev version and wait for it to be built
2. Open Chrome and load URL: `chrome://extensions`
3. Turn `Developer mode` on in the top right
4. At the top, click `Load Unpacked Extension`
5. Navigate to your `qrypto/dist` folder
6. Click `Select`. The extension should now be loaded
7. Click on the Qrypto logo in your Chrome extensions bar to open

## Security Flow
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
