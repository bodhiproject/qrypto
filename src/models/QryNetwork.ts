import { Network as qjswNetwork } from 'qtumjs-wallet';

export default class QryNetwork {
  public name: string;
  public network: qjswNetwork;

  constructor(name: string, network: qjswNetwork) {
    this.name = name;
    this.network = network;
  }
}
