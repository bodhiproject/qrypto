import { networks, Wallet } from 'qtumjs-wallet'
import { observable, action, runInAction } from 'mobx';


class WalletStore {
  qjsWallet:any = null
  @observable mnemonic = ''
  @observable info: any = {}
  @observable tip = ''

  @observable sendToAddress:any = 'qcdw8hSkYmxt7kmHFoZ6J5aYUdM3A29idz'
  @observable sendToTokenType = 'QTUM'
  @observable sendToAmount:any = '0'

  constructor(){
    console.log("wallet store constructor")
    chrome.storage.local.get('mnemonic', ({ mnemonic }) => {
      if (mnemonic == null) {
        return
      }

      this.mnemonic = mnemonic
      this.qjsWallet = this.recoverWallet(mnemonic)
      this.info = this.getWalletInfo()
    })
  }

  private recoverWallet(mnemonic: string = this.mnemonic): Wallet {
    console.log("wallet store recoverWallet, mnemonic:", mnemonic)
    const network = networks.testnet
    return network.fromMnemonic(mnemonic)
  }

  @action
  private async getWalletInfo() {
    this.info = await this.qjsWallet.getInfo()
  }

  public handleRecover() {
    this.qjsWallet = this.recoverWallet()
    chrome.storage.local.set({ mnemonic: this.mnemonic })
    this.getWalletInfo()
  }

  @action
  public async send() {
    this.tip = 'sending...'
    try {
      await this.qjsWallet.send(this.sendToAddress, this.sendToAmount * 1e8, {
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
}

export default new WalletStore()