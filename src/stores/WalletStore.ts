import { networks, Wallet, Insight } from 'qtumjs-wallet'
import { observable, action, runInAction } from 'mobx'


class WalletStore {
  @observable public info?: Insight.IGetInfo = undefined
  @observable public tip = ''

  private qjsWallet?: Wallet = undefined

  @observable private mnemonic: string = ''
  @observable private enteredMnemonic: string = ''

  @observable private sendToAddress = 'qcdw8hSkYmxt7kmHFoZ6J5aYUdM3A29idz'
  @observable private sendToTokenType = 'QTUM'
  @observable private sendToAmount: any = '0'

  private getInfoInterval?: NodeJS.Timer = undefined

  constructor() {
    chrome.storage.local.get('mnemonic', async ({ mnemonic }) => {
      if (mnemonic == null) {
        return
      }

      this.mnemonic = mnemonic
      this.qjsWallet = this.recoverWallet(mnemonic)
      this.info = await this.getWalletInfo()
    })
  }

  @action
  public onImportNewMnemonic() {
    this.qjsWallet = this.recoverWallet(this.enteredMnemonic);
    chrome.storage.local.set({ mnemonic: this.enteredMnemonic });
  }

  @action
  public async send() {
    this.tip = 'sending...'
    try {
      await this.qjsWallet!.send(this.sendToAddress, this.sendToAmount * 1e8, {
        feeRate: 4000,
      })
      runInAction(() => {
        this.tip = 'done'
      })
    } catch (err) {
      console.log(err)
      this.tip = err.message
    }
  }

  @action
  public startGetInfoPolling() {
    this.getInfoInterval = setInterval(async () => {
      this.info = await this.qjsWallet!.getInfo()
    }, 5000)
  }

  @action
  public stopGetInfoPolling() {
    if (this.getInfoInterval) {
      clearInterval(this.getInfoInterval)
    }
  }

  @action
  public clearMnemonic = () => {
    this.mnemonic = ''
    this.enteredMnemonic = ''
  }

  @action
  private async getWalletInfo() {
    this.info = await this.qjsWallet!.getInfo()
    return this.info
  }

  private recoverWallet(mnemonic: string = this.mnemonic): Wallet {
    console.log('wallet store recoverWallet, mnemonic:', mnemonic)
    const network = networks.testnet
    return network.fromMnemonic(mnemonic)
  }
}

export default new WalletStore()
