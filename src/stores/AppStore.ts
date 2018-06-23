
import walletStore from './WalletStore'
import uiStore from './UiStore'

class AppStore {
  location = '/import-mnemonic'
  ui = {}
  walletStore = {}

  constructor(){
    this.ui = uiStore
    this.walletStore = walletStore
  }
  
}

const store = new AppStore()
window.store = store //allows us to see store in browser console for debugging
export default store