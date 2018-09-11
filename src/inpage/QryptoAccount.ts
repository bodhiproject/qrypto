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

  public setQryptoAccountValues(payload: any) {
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
