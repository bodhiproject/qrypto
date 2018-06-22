import * as React from 'react';
import { networks, Wallet, Insight} from 'qtumjs-wallet'
import { Redirect, withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { inject, observer } from 'mobx-react';

// function recoverWallet(mnemonic: string): Wallet {
//   const network = networks.testnet
//   return network.fromMnemonic(mnemonic)
// }

@withRouter
@inject('store')
@observer
class ImportMnemonic extends React.Component<{}, IState> {

  // public constructor(props: {}){
  //   super(props)

  //   this.state = {
  //     mnemonic: '',
  //     amount: 0,
  //     receiver: '',
  //     tip: '',
  //     tempRefresher: '',
  //   }
  // }

  public render(){ 
    console.log("render props:", this.props)
    const { walletStore } = this.props.store

    // if (walletStore.qjsWallet) { // TODO: come back to after mnemonic
    //   console.log("rendering wallet")
    //   return <Redirect to='/' />
    // }

    return(
      <div>
        <h3>ImportMnemonic Page</h3>
        <input type="text" onChange={(e) => walletStore.mnemonic = e.target.value} value={walletStore.mnemonic} />
        <Button variant="contained" color="primary" onClick={this.recoverAndGoToHomePage}>
          Import Wallet
        </Button>
      </div>  
    )
  }

  public recoverAndGoToHomePage = () => {
    const { store: { walletStore }, history } = this.props
    walletStore.handleRecover ()
    history.push('/')
  }

  // private handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  //   // this.setState({ mnemonic: event.target.value })
  //   this.props.store.walletStore.mnemonic = event.target.value 
  // }

  // private handleRecover: React.MouseEventHandler<HTMLButtonElement> = () => {
  //   console.log("Importmnemonic handleRecover")

  //   //TODO - temporary for development
  //   const { mnemonic } = this.state
  //   // const mnemonic = "hold struggle ready lonely august napkin enforce retire pipe where avoid drip"
  //   try {
  //     //TODO? - make the recoverWallet method save the wallet directly to the walletStore
  //     const wallet = this.props.store.walletStore.recoverWallet(mnemonic)
  //     chrome.storage.local.set({ mnemonic })
  //     this.props.store.walletStore.qjsWallet = wallet
  //     // this.setState({wallet})
  //     // this.getWalletInfo()
  //     // console.log(wallet)

  //     //TODO, is there a better way to do this? I just needed to re-render, and state was no longer getting updated and triggering the render because wallet got moved to mobx
  //     // this.render()
  //     this.setState({tempRefresher: "a"})

  //   } catch (err) {
  //     console.log('cannot set mnemonic', err)
  //   }

  //   //ORIGINAL
  //   // this.setState({ wallet: undefined, receiver: '', amount: 0, tip: '' })
  //   // //TODO - temporary for development
  //   // const { mnemonic } = this.state
  //   // // const mnemonic = "hold struggle ready lonely august napkin enforce retire pipe where avoid drip"
  //   // try {
  //   //   const wallet = this.props.store.walletStore.recoverWallet(mnemonic)
  //   //   chrome.storage.local.set({ mnemonic })
  //   //   this.setState({wallet})
  //   //   this.getWalletInfo()
  //   //   console.log(wallet)
  //   // } catch (err) {
  //   //   console.log('cannot set mnemonic', err)
  //   // }
  // }
}

interface IState {
  mnemonic: string
  wallet?: Wallet
  info?: Insight.IGetInfo
  receiver: string
  amount: number
  tip: string
  tempRefresher: string
  walletStore: any
}

export default ImportMnemonic 