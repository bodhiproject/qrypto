import { observable } from 'mobx';

export default class QRCToken {
  @observable public name: string;
  @observable public abbreviation: string;
  @observable public decimals: number;
  @observable public address: string;
  @observable public balance: number;

  constructor(name: string, abbreviation: string, decimals: number, address: string) {
    this.name = name;
    this.abbreviation = abbreviation;
    this.decimals = decimals;
    this.address = address;
    this.balance = 0;
  }
}
