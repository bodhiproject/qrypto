import { Network as QjswNetwork } from 'qtumjs-wallet';

export default class QryNetwork {
  public name: string;
  public network: QjswNetwork;

  constructor(name: string, network: QjswNetwork) {
    this.name = name;
    this.network = network;
  }
}
