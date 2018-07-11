import { isFinite } from 'lodash';

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
