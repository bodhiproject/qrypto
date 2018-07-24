import { isFinite } from 'lodash';
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
* Validates the Qtum address based on length and starting character.
* @param address {string} The Qtum address to validate.
* @param isTestnet {boolean} Flag if is a testnet address (or else mainnet address).
* @return {boolean} Returns if it is a valid Qtum address.
*/
export const isValidAddress = (address: string, isTestnet: boolean) => {
  if (!address) {
    return false;
  }
  if (address.length !== 34) {
    return false;
  }
  if (isTestnet) {
    return address.startsWith('q');
  }
  return address.startsWith('Q');
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
