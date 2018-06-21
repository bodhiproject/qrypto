import * as React from 'react';
import { networks, Wallet, Insight} from 'qtumjs-wallet'
import { Redirect } from "react-router-dom";
import Button from '@material-ui/core/Button';

function recoverWallet(mnemonic: string): Wallet {
  const network = networks.testnet
  return network.fromMnemonic(mnemonic)
}

class ImportMnemonic extends React.Component<{}, IState> {

  public constructor(props: {}){
    super(props)

    this.state = {
      mnemonic: '',
      amount: 0,
      receiver: '',
      tip: '',
    }
  }

  public componentDidMount() {
    if (!!this.state.mnemonic) {
      return
    }

    chrome.storage.local.get('mnemonic', ({ mnemonic }) => {
      if (mnemonic == null) {
        return
      }

      const wallet = recoverWallet(mnemonic)
      this.setState({ mnemonic, wallet })
      this.getWalletInfo()
    })
  }

  public render(){ 
    const { mnemonic, wallet } = this.state
    
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
  }

  private handleRecover: React.MouseEventHandler<HTMLButtonElement> = () => {
    this.setState({ wallet: undefined, receiver: '', amount: 0, tip: '' })

    //TODO - temporary for development
    const { mnemonic } = this.state
    // const mnemonic = "hold struggle ready lonely august napkin enforce retire pipe where avoid drip"
    try {
      const wallet = recoverWallet(mnemonic)
      chrome.storage.local.set({ mnemonic })
      this.setState({wallet})
      this.getWalletInfo()
      console.log(wallet)
    } catch (err) {
      console.log('cannot set mnemonic', err)
    }
  }
}

interface IState {
  mnemonic: string
  wallet?: Wallet
  info?: Insight.IGetInfo
  receiver: string
  amount: number
  tip: string
}

export default ImportMnemonic 