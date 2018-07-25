import { observable } from 'mobx';

export default class QRCToken {
  @observable public name: string;
  @observable public abbreviation: string;
  @observable public address: string;

  constructor(name: string, abbreviation: string, address: string) {
    this.name = name;
    this.abbreviation = abbreviation;
    this.address = address;
  }
}
