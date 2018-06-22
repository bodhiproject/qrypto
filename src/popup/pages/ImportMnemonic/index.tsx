import * as React from 'react';
import { networks, Wallet, Insight} from 'qtumjs-wallet'
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { inject, observer } from 'mobx-react';

// function recoverWallet(mnemonic: string): Wallet {
//   const network = networks.testnet
//   return network.fromMnemonic(mnemonic)
// }

@inject('store')
@observer
class ImportMnemonic extends React.Component<{}, IState> {

  public constructor(props: {}){
    super(props)

    this.state = {
      mnemonic: '',
      amount: 0,
      receiver: '',
      tip: '',
      tempRefresher: '',
    }
  }

  public componentDidMount() {
    if (!!this.state.mnemonic) {
      return
    }

    // chrome.storage.local.get('mnemonic', ({ mnemonic }) => {
    //   if (mnemonic == null) {
    //     return
    //   }

    //   const wallet = recoverWallet(mnemonic)
    //   this.setState({ mnemonic, wallet })
    //   this.getWalletInfo()
    // })
  }

  public render(){ 
    console.log("render props:", this.props)
    // const { mnemonic, wallet } = this.state
    const { mnemonic } = this.state
    const { walletStore } = this.props.store
    // const mnemonic =  walletStore.mnemonic
    const wallet = walletStore.qjsWallet

    if (wallet) {
      console.log("rendering wallet")
      return <Redirect to='/' />
    }

    return(
      <div>
        <h3>ImportMnemonic Page</h3>
        <input type="text" onChange={this.handleInputChange} value={mnemonic} />
        <Button variant="contained" color="primary" onClick={this.handleRecover}>
          Import Wallet
        </Button>
      </div>  
    )
  }

  private async getWalletInfo() {
    const wallet = this.state.wallet!
    const info = await wallet.getInfo()
    this.setState({info, tip: ''})
  }

  private handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    this.setState({ mnemonic: event.target.value })
    // this.props.store.walletStore.mnemonic = event.target.value 
  }

  private handleRecover: React.MouseEventHandler<HTMLButtonElement> = () => {
    console.log("Importmnemonic handleRecover")
    // // this.setState({ wallet: undefined, receiver: '', amount: 0, tip: '' })

    // const { walletStore } = this.props.store
    // const { mnemonic } = walletStore
    
    // //TODO - temporary for development
    // // const mnemonic = "hold struggle ready lonely august napkin enforce retire pipe where avoid drip"
    // try {
    //   const wallet = walletStore.recoverWallet(mnemonic)
    //   chrome.storage.local.set({ mnemonic })
    //   // this.setState({wallet})
    //   this.getWalletInfo()
    //   console.log(wallet)
    // } catch (err) {
    //   console.log('cannot set mnemonic', err)
    // }

    // this.setState({ wallet: undefined, receiver: '', amount: 0, tip: '' })

    //TODO - temporary for development
    const { mnemonic } = this.state
    // const mnemonic = "hold struggle ready lonely august napkin enforce retire pipe where avoid drip"
    try {
      const wallet = this.props.store.walletStore.recoverWallet(mnemonic)
      chrome.storage.local.set({ mnemonic })
      this.props.store.walletStore.qjsWallet = wallet
      // this.setState({wallet})
      // this.getWalletInfo()
      // console.log(wallet)

      //TODO, is there a better way to do this? I just needed to re-render, and state was no longer getting updated and triggering the render because wallet got moved to mobx
      // this.render()
      this.setState({tempRefresher: "a"})

    } catch (err) {
      console.log('cannot set mnemonic', err)
    }

    // this.setState({ wallet: undefined, receiver: '', amount: 0, tip: '' })

    // //TODO - temporary for development
    // const { mnemonic } = this.state
    // // const mnemonic = "hold struggle ready lonely august napkin enforce retire pipe where avoid drip"
    // try {
    //   const wallet = this.props.store.walletStore.recoverWallet(mnemonic)
    //   chrome.storage.local.set({ mnemonic })
    //   this.setState({wallet})
    //   this.getWalletInfo()
    //   console.log(wallet)
    // } catch (err) {
    //   console.log('cannot set mnemonic', err)
    // }
  }
}

interface IState {
  mnemonic: string
  wallet?: Wallet
  info?: Insight.IGetInfo
  receiver: string
  amount: number
  tip: string
  tempRefresher: string
}

export default ImportMnemonic 