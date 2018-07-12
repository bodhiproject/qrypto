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
  TESTNET_ACCOUNTS = 'testnetAccounts',
  MAINNET_ACCOUNTS = 'mainnetAccounts',
<<<<<<< HEAD
}

export enum SEND_STATE {
  INITIAL = 'Confirm',
  SENDING = 'Sending...',
  SENT = 'Sent!',
=======
>>>>>>> Implement NetworkStore (connect to networkSwitcherUI code; during a network switch - set the network, reload new accounts from chrome storage, reset login page default account); reset account/wallet defaults when the user logs out
}
