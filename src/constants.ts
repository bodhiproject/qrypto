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
  // Actions
  ROUTE_LOGIN,
  RESTORE_SESSION,
  LOGIN,
  LOGIN_SUCCESS_WITH_ACCOUNTS,
  LOGIN_SUCCESS_NO_ACCOUNTS,
  LOGIN_FAILURE,
  CREATE_WALLET,
  SAVE_TO_FILE,
  IMPORT_MNEMONIC,
  IMPORT_MNEMONIC_FAILURE,
  ACCOUNT_LOGIN,
  ACCOUNT_LOGIN_SUCCESS,
  START_TX_POLLING,
  STOP_TX_POLLING,
  GET_MORE_TXS,
  GET_TXS_RETURN,
  SEND_TOKENS,
  SEND_TOKENS_SUCCESS,
  SEND_TOKENS_FAILURE,
  START_QRC_TOKEN_BALANCE_POLLING,
  STOP_QRC_TOKEN_BALANCE_POLLING,
  QRC_TOKEN_BALANCES_RETURN,
  LOGOUT,
  CHANGE_NETWORK,
  CHANGE_NETWORK_SUCCESS,

  // Getters
  GET_NETWORKS,
  GET_NETWORK_INDEX,
  GET_ACCOUNTS,
  GET_LOGGED_IN_ACCOUNT,
  GET_WALLET_INFO,
  GET_WALLET_INFO_RETURN,
  GET_QRC_TOKEN_LIST,
  GET_ACCOUNT_INFO,
  GET_QTUM_BALANCE_USD,
  GET_QTUM_PRICE_RETURN,
  IS_MAINNET,
  HAS_ACCOUNTS,
  VALIDATE_WALLET_NAME,
}

export enum RESPONSE_TYPE {
  RESTORING_SESSION,
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
