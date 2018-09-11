const INIT_VALUES = {
  loggedIn: false,
  name: '',
  network: '',
  address: '',
  balance: 0,
};

export class InpageAccount {
  public loggedIn: boolean;
  public name: string;
  public network: string;
  public address: string;
  public balance: number;

  constructor() {
    this.loggedIn = INIT_VALUES.loggedIn;
    this.name = INIT_VALUES.name;
    this.network = INIT_VALUES.network;
    this.address = INIT_VALUES.address;
    this.balance = INIT_VALUES.balance;
  }
}
