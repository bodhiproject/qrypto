import { observable, action, runInAction } from 'mobx';

import walletStore from './WalletStore';

const INIT_VALUES = {
  senderAddress: '',
  receiverAddress: '',
  token: 'QTUM',
  amount: 0,
  tip: '',
};

class SendStore {
  @observable public senderAddress: string = INIT_VALUES.senderAddress;
  @observable public receiverAddress: string = INIT_VALUES.receiverAddress;
  @observable public token: string = INIT_VALUES.token;
  @observable public amount: string = INIT_VALUES.amount;
  @observable public tip: string = INIT_VALUES.tip;

  @action
  public async send() {
    try {
      this.tip = 'Sending...';
      await walletStore.wallet!.send(this.receiverAddress, this.amount * 1e8, {
        feeRate: 4000,
      });

      runInAction(() => this.tip = 'Sent!');
    } catch (err) {
      console.log(err);
      runInAction(() => this.tip = err.message);
    }
  }
}

export default new SendStore();
