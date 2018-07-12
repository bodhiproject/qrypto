export enum TARGET_NAME {
  INPAGE = 'my_extension_inpage',
  CONTENTSCRIPT = 'my_extension_contentscript',
}

export enum PORT_NAME {
  POPUP = 'my_extension_popup',
  CONTENTSCRIPT = 'my_extension_contentscript',
}

export enum API_TYPE {
  SEND_QTUM_REQUEST,
  SEND_QTUM_RESPONSE,
}

export enum STORAGE {
  APP_SALT = 'appSalt',
  PASSWORD_HASH = 'passwordHash',
  TESTNET_ACCOUNTS = 'testnetAccounts',
  MAINNET_ACCOUNTS = 'mainnetAccounts',
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
