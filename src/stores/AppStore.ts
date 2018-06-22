
import walletstore from './WalletStore'

class AppStore {
  walletStore = {}

  constructor(){
    this.walletStore = walletstore
  }
  
}

const store = new AppStore()
window.store = store //allows us to see store in browser console for debugging
export default store