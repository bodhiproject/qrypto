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
  ROUTE_LOGIN,
  ROUTE_HOME,
  LOGIN,
  LOGIN_SUCCESS_WITH_ACCOUNTS,
  LOGIN_SUCCESS_NO_ACCOUNTS,
  LOGIN_FAILURE,
  CREATE_WALLET,
  SAVE_TO_FILE,
  IMPORT_MNEMONIC,
  IMPORT_MNEMONIC_FAILURE,
  ACCOUNT_LOGIN,
  LOGOUT,
  CHANGE_NETWORK,
  GET_ACCOUNTS,
  GET_LOGGED_IN_ACCOUNT,
  GET_WALLET_INFO,
  GET_WALLET_INFO_RETURN,
  GET_ACCOUNT_INFO,
  GET_QTUM_BALANCE_USD,
  GET_QTUM_PRICE_RETURN,
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
