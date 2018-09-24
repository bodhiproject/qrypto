import { isFinite } from 'lodash';
import { validatePrivateKey } from 'qtumjs-wallet';

import { TARGET_NAME } from '../constants';
import { IExtensionMessageData } from '../types';

/*
* Validates a MessageEvent.
* @param event The message to validate.
* @param targetName The expected target for the message.
*/
export const isMessageNotValid = (event: MessageEvent, targetName: TARGET_NAME): boolean => {
  const data: IExtensionMessageData<any> = event.data;
  return event.origin !== location.origin
    || event.source !== window
    || typeof data !== 'object'
    || data.message == null
    || data.target !== targetName;
};

/*
* Generates a random string id.
* @return The random string id.
*/
export const generateRandomId = (): string => {
  return Math.random().toString().slice(-8);
};

/*
* Validates the Qtum address based on length and starting character.
* @param isMainNet {boolean} Flag if is a mainnet address (or else testnet address).
* @param address {string} The Qtum address to validate.
* @return {boolean} Returns if it is a valid Qtum address.
*/
export const isValidAddress = (isMainNet: boolean, address?: string) => {
  if (!address) {
    return false;
  }
  if (address.length !== 34) {
    return false;
  }
  if (isMainNet) {
    return address.startsWith('Q');
  }
  return address.startsWith('q');
};

export const isValidPrivateKey = (address?: string) => {
  if (!address) {
    return false;
  }
  if (address.length !== 52) {
    return false;
  }

  try {
    return validatePrivateKey(address);
  } catch (e) {
    console.error('Private Key Invalid', e);
    return false;
  }
};

export const isValidContractAddressLength = (address?: string) => {
  return address && address.length === 40;
};

/*
* Validates the amount of tokens to send.
* @param amount {number} The amount of tokens to validate.
* @param maxAllowed {number} The max amount of tokens you can send.
* @return {boolean} Returns if it is a valid send amount.
*/
export const isValidAmount = (amount: number, maxAllowed: number) => {
  if (!isFinite(amount) || !isFinite(maxAllowed)) {
    return false;
  }
  if (amount <= 0) {
    return false;
  }
  if (amount > maxAllowed) {
    return false;
  }
  return true;
};

export const isValidGasLimit = (gasLimit: number) => {
  return isFinite(gasLimit) && gasLimit > 0;
};

export const isValidGasPrice = (gasPrice: number) => {
  return isFinite(gasPrice) && gasPrice > 0;
};

/*
* Handles the Enter key pressed of an input field.
* @param event The event object.
* @param onEnter The function callback to execute.
*/
export const handleEnterPress = (event: any, onEnter: any) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    onEnter();
  }
};

/*
* Generates an RPC request ID.
* @return Generated request ID.
*/
export const generateRequestId = (): string => {
  return Math.random().toString().slice(-8);
};

/*
* Formats and returns an ellipsized txid.
* @param txid Transaction ID.
* @return Ellipsized transaction ID.
*/
export const shortenTxid = (txid?: string) => {
  if (!txid) {
    return '';
  }
  const charToShow = 5;
  return `${txid.substr(0, charToShow)}...${txid.substr(txid.length - charToShow, txid.length)}`;
};
