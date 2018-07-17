export enum TARGET_NAME {
  INPAGE = 'my_extension_inpage',
  CONTENTSCRIPT = 'my_extension_contentscript',
}

export enum PORT_NAME {
  POPUP = 'my_extension_popup',
  CONTENTSCRIPT = 'my_extension_contentscript',
}

export enum API_TYPE {
  RPC_REQUEST,
  RPC_RESONSE,
}

export enum STORAGE {
  APP_SALT = 'appSalt',
  TESTNET_ACCOUNTS = 'testnetAccounts',
  MAINNET_ACCOUNTS = 'mainnetAccounts',
  LOGGED_IN_ACCOUNT = 'loggedInAccount',
}

export enum SEND_STATE {
  INITIAL = 'Confirm',
  SENDING = 'Sending...',
  SENT = 'Sent!',
}

export enum NETWORK_NAMES {
  TESTNET = 'TestNet',
  MAINNET = 'MainNet',
}
