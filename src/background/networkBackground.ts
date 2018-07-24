import { networks, Network } from 'qtumjs-wallet';

import Background from '.';
import { MESSAGE_TYPE, STORAGE, NETWORK_NAMES } from '../constants';
import QryNetwork from '../models/QryNetwork';

export default class NetworkBackground {
  public static NETWORKS: QryNetwork[] = [
    new QryNetwork(NETWORK_NAMES.MAINNET, networks.mainnet),
    new QryNetwork(NETWORK_NAMES.TESTNET, networks.testnet),
  ];

  public get isMainNet(): boolean {
    return this.networkIndex === 0;
  }
  public get network(): Network  {
    return NetworkBackground.NETWORKS[this.networkIndex].network;
  }

  private bg: Background;
  private networkIndex: number = 1;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.onMessage);
    chrome.storage.local.get([STORAGE.NETWORK_INDEX], ({ networkIndex }: any) => {
      if (networkIndex !== undefined) {
        this.networkIndex = networkIndex;
        chrome.runtime.sendMessage({ type: MESSAGE_TYPE.CHANGE_NETWORK_SUCCESS, networkIndex: this.networkIndex });
      }

      this.bg.onInitFinished('network');
    });
  }

  public changeNetwork = (networkIndex: number) => {
    if (this.networkIndex !== networkIndex) {
      this.networkIndex = networkIndex;
      chrome.storage.local.set({
        [STORAGE.NETWORK_INDEX]: networkIndex,
      }, () => console.log('networkIndex changed', networkIndex));

      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.CHANGE_NETWORK_SUCCESS, networkIndex });
      this.bg.account.logoutAccount();
    }
  }

  private onMessage = (request: any, _: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
    switch (request.type) {
      case MESSAGE_TYPE.CHANGE_NETWORK:
        this.changeNetwork(request.networkIndex);
        break;
      case MESSAGE_TYPE.GET_NETWORKS:
        sendResponse(NetworkBackground.NETWORKS);
        break;
      case MESSAGE_TYPE.GET_NETWORK_INDEX:
        sendResponse(this.networkIndex);
        break;
      case MESSAGE_TYPE.IS_MAINNET:
        sendResponse(this.isMainNet);
        break;
      default:
        break;
    }
  }
}
