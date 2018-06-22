import { networks, Wallet, Insight} from 'qtumjs-wallet'
import { observable, action } from 'mobx';

class WalletStore {
  qjsWallet:any = null
  @observable mnemonic = ''
  info: any = null

  constructor(){
    console.log("wallet store constructor")
    chrome.storage.local.get('mnemonic', ({ mnemonic }) => {
      if (mnemonic == null) {
        return
      }

      this.qjsWallet = this.recoverWallet(mnemonic)
      // this.mnemonic = mnemonic
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
  // private async getWalletInfo() { // REF
  //   const wallet = this.state.wallet!
  //   const info = await wallet.getInfo()
  //   this.setState({info, tip: ''})
  // }

  public handleRecover() {
    this.qjsWallet = this.recoverWallet()
    chrome.storage.local.set({ mnemonic: this.mnemonic })
    this.getWalletInfo()
  }
  
}

export default new WalletStore()