import { networks, Wallet, Insight} from 'qtumjs-wallet'
import { observable } from 'mobx';

class WalletStore {
  qjsWallet:any = null
  // mnemonic = ''

  constructor(){
    console.log("wallet store constructor")
    chrome.storage.local.get('mnemonic', ({ mnemonic }) => {
      if (mnemonic == null) {
        return
      }

      this.qjsWallet = this.recoverWallet(mnemonic)
      // this.mnemonic = mnemonic
      // this.getWalletInfo()
    })
  }

  private recoverWallet(mnemonic: string): Wallet {
    console.log("wallet store recoverWallet, mnemonic:", mnemonic)
    const network = networks.testnet
    return network.fromMnemonic(mnemonic)
  }
  
}

export default new WalletStore()