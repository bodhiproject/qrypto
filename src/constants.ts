export enum TARGET_NAME {
  INPAGE = 'qrypto-inpage',
  CONTENTSCRIPT = 'qrypto-contentscript',
  BACKGROUND = 'qrypto-background',
}

export enum PORT_NAME {
  POPUP = 'qrypto-popup',
  CONTENTSCRIPT = 'qrypto-contentscript',
}

export enum API_TYPE {
  RPC_REQUEST,
  RPC_RESONSE,
}

export enum MESSAGE_TYPE {
  LOGIN,
  LOGIN_SUCCESS_WITH_ACCOUNTS,
  LOGIN_SUCCESS_NO_ACCOUNTS,
}

export enum STORAGE {
  APP_SALT = 'appSalt',
  TESTNET_ACCOUNTS = 'testnetAccounts',
  MAINNET_ACCOUNTS = 'mainnetAccounts',
  LOGGED_IN_ACCOUNT = 'loggedInAccount',
  NETWORK_INDEX = 'networkIndex',
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
