import { networks, Wallet, Insight } from 'qtumjs-wallet';
import { observable, action, runInAction } from 'mobx';

class WalletStore {
  @observable public info?: Insight.IGetInfo = undefined;
  @observable public tip = '';

  @observable private mnemonic: string = '';
  // TODO - specific mnemonic is temporary, and is in place as a convenience for development, remove before production release
  @observable private enteredMnemonic: string = 'hold struggle ready lonely august napkin enforce retire pipe where avoid drip';
  // TODO: remove when var is used
  // tslint:disable-next-line
  @observable private senderAddress: string = '';
  @observable private receiverAddress: string = '';
  // TODO: remove when var is used
  // tslint:disable-next-line
  @observable private token: string = 'QTUM';
  @observable private amount: string = '0';

  private qjsWallet?: Wallet = undefined;
  private getInfoInterval?: NodeJS.Timer = undefined;

  constructor() {
    chrome.storage.local.get('mnemonic', async ({ mnemonic }) => {
      if (mnemonic == null) {
        return;
      }

      this.mnemonic = mnemonic;
      this.qjsWallet = this.recoverWallet(mnemonic);
      this.info = await this.getWalletInfo();
    });
  }

  @action
  public onImportNewMnemonic() {
    this.qjsWallet = this.recoverWallet(this.enteredMnemonic);
    chrome.storage.local.set({ mnemonic: this.enteredMnemonic });
  }

  @action
  public async send() {
    this.tip = 'sending...';
    try {
      await this.qjsWallet!.send(this.receiverAddress, this.amount * 1e8, {
        feeRate: 4000,
      });
      runInAction(() => {
        this.tip = 'done';
      });
    } catch (err) {
      console.log(err);
      this.tip = err.message;
    }
  }

  @action
  public startGetInfoPolling() {
    this.getInfoInterval = setInterval(async () => {
      this.info = await this.qjsWallet!.getInfo();
    }, 5000);
  }

  @action
  public stopGetInfoPolling() {
    if (this.getInfoInterval) {
      clearInterval(this.getInfoInterval);
    }
  }

  @action
  public clearMnemonic = () => {
    this.mnemonic = '';
    this.enteredMnemonic = '';
  }

  @action
  private async getWalletInfo() {
    this.info = await this.qjsWallet!.getInfo();
    return this.info;
  }

  private recoverWallet(mnemonic: string = this.mnemonic): Wallet {
    console.log('wallet store recoverWallet, mnemonic:', mnemonic);
    const network = networks.testnet;
    return network.fromMnemonic(mnemonic);
  }
}

export default new WalletStore();
