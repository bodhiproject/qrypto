import { WalletRPCProvider, Insight } from 'qtumjs-wallet';
import { Contract, Decoder } from 'qweb3';
import { find } from 'lodash';

import Background from '.';
import qrc20TokenABI from '../contracts/qrc20TokenABI';

export default class RPCBackground {
  private bg: Background;
  private rpcProvider?: WalletRPCProvider;

  constructor(bg: Background) {
    this.bg = bg;
    chrome.runtime.onMessage.addListener(this.onMessage);
  }

  public createRpcProvider = async () => {
    const wallet = this.bg.wallet.wallet;
    if (wallet) {
      this.rpcProvider = new WalletRPCProvider(wallet);
      await this.getBalance('qMZK8FNPRm54jvTLAGEs1biTCgyCkcsmna');
    }
  }

  public getBalance = async (balanceAddress: string) => {
    await this.callContract('a6dd0b0399dc6162cedde85ed50c6fa4a0dd44f1', 'balanceOf', [balanceAddress]);
  }

  private callContract = async (contractAddress: string, methodName: string, args: any[]) => {
    if (this.rpcProvider) {
      const contract = new Contract('', contractAddress, qrc20TokenABI);
      const methodObj = find(contract.abi, { name: methodName });
      const dataHex = contract.constructDataHex(methodObj, args);

      let res: Insight.IContractCall = await this.rpcProvider.rawCall('callContract', [
        contract.address,
        dataHex,
      ]) as Insight.IContractCall;
      res = Decoder.decodeCall(
        res,
        contract.abi,
        methodName,
      );
      console.log(res.executionResult.formattedOutput[0].toString());
    }
  }

  private onMessage = (request: any) => {
    switch (request.type) {
      default:
        break;
    }
  }
}
