const dedent = require('dedent-js');

const INIT_VALUES = {
  loggedIn: false,
  name: '',
  network: '',
  address: '',
  balance: 0,
};

export class QryptoAccount {
  public loggedIn: boolean = INIT_VALUES.loggedIn;
  public name: string = INIT_VALUES.name;
  public network: string = INIT_VALUES.network;
  public address: string = INIT_VALUES.address;
  public balance: number = INIT_VALUES.balance;

  /* This method gives a tie in to the dapp, so that it can be notified
  when a user logs in or out of qrypto. The dapp overwrites this method.
  */
  public statusChanged() {
    const text = dedent`window.qrypto.account has changed.
    Overwrite the function window.qrypto.account.statusChanged to make this notification interact with your dapp.
    Ex: window.qrypto.account.statusChanged = function () { console.log('<running dapp code...>') }`;
    console.log(text);
  }

  public setQryptoAccountValues(payload: any) {
    if (payload.loggedIn !== this.loggedIn) {
      this.statusChanged();
    }

    if (payload.loggedIn) {
      this.loggedIn = payload.loggedIn;
      this.name = payload.name;
      this.network = payload.network;
      this.address = payload.address;
      this.balance = payload.balance;
    } else {
      Object.assign(this, INIT_VALUES);
    }
  }
}
