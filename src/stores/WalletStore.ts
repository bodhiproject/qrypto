import { networks, Wallet, Insight } from 'qtumjs-wallet';
import { observable, action, runInAction } from 'mobx';
import transactionStore from './TransactionStore';

// export default class WalletStore {
class WalletStore {
  @observable public info?: Insight.IGetInfo = undefined;
  @observable public tip = '';

  //Loading screen flow for app first load and import mnemonic
  // 1 Default -> loading true
  // 2 chrome.storage loading mnemonic
  //   if mnemonic does not exist -> loading false 
  //     -(redirects to importMnemonic page)
  //     -importMnemonic pressed -> loading true (go to 3) 
  //   if mnemonic exists -> loading still true (go to 3) 
  // 3 on wallet load/info loaded -> loading false
  @observable public loading = true;

  @observable private mnemonic: string = '';
  @observable private enteredMnemonic: string = '';
  @observable private senderAddress: string = '';
  @observable private receiverAddress: string = '';
  // TODO: remove when var is used
  // tslint:disable-next-line
  @observable private token: string = 'QTUM';
  @observable private amount: string = '0';

  private qjsWallet?: Wallet = undefined;
  private getInfoInterval?: NodeJS.Timer = undefined;

  constructor() {
    console.log("constructor walletStore")
    setTimeout(this.init.bind(this), 100)
  }

  init(){
    chrome.storage.local.get('mnemonic', async ({ mnemonic }) => {
      if (mnemonic == null) {
        console.log("NOT load mnemonic from chrome store")
        this.loading = false;
        return;
      }
      console.log("YES load mnemonic from chrome store")
      this.mnemonic = mnemonic;
      this.qjsWallet = this.recoverWallet(mnemonic);
      this.getWalletInfo();
      this.loading = false;
    });
  }

  @action
  public onImportNewMnemonic() {
    this.qjsWallet = this.recoverWallet(this.enteredMnemonic);
    chrome.storage.local.set({ mnemonic: this.enteredMnemonic });
    this.getWalletInfo(); //getInfo once prior to setInterval so there is no delay
    this.loading = false;
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
    this.getInfoInterval = setInterval(() => {
      this.getWalletInfo();
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
    transactionStore.loadFromIds(this.info.transactions);

    return this.info;
  }

  private recoverWallet(mnemonic: string = this.mnemonic): Wallet {
    console.log('wallet store recoverWallet, mnemonic:', mnemonic);
    const network = networks.testnet;
    return network.fromMnemonic(mnemonic);
  }
}

export default new WalletStore();
export { WalletStore };
