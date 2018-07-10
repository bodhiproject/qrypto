/*
* Validates the Qtum address based on length and starting character.
* @param address {string} The Qtum address to validate.
* @param isTestnet {boolean} Flag if is a testnet address (or else mainnet address).
* @return {boolean} Returns if it is a valid Qtum address.
*/
export const validateAddress = (address: string, isTestnet: boolean) => {
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
