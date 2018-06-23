import React, { Component } from 'react';
import './App.scss'
import { BrowserRouter as Router, Redirect, Route, Link } from "react-router-dom"

import ImportMnemonic from './pages/ImportMnemonic'
import Home from './pages/Home'
import AccountDetail from './pages/AccountDetail'
import Send from './pages/Send';
import Receive from './pages/Receive'
import SendConfirm from './pages/SendConfirm'

import { Provider as MobxProvider } from 'mobx-react'
import store from '../stores/AppStore'

class App extends Component<IProps, {}> {

  componentWillUnmount() {
    const { stopGetInfoPolling } = this.props.store.walletStore;

    stopGetInfoPolling();
  }

  public render() {

    return (
      <MobxProvider store={store}>
        <Router>
          <div >
            {/* TODO - this will later become:
            - if wallet does not exist in storage(which we will store in a state), route to the import/create mnemonic, 
            -else route to login */}
            <Redirect to='/import-mnemonic' />

            <Route exact path="/" component={Home} />
            <Route exact path="/import-mnemonic" component={ImportMnemonic} />
            <Route exact path="/account-detail" component={AccountDetail} />
            <Route exact path="/send" component={Send} />
            <Route exact path="/send-confirm" component={SendConfirm} />
            <Route exact path="/receive" component={Receive} />
          </div>
        </Router>
      </MobxProvider>
    )
  }

  //TODO? handleRefresh to update QTUM balance? where do we want to put this button?

  //REFERENCE
  // public renderWallet() {
  //   const {info, tip} = this.state

  //   return (
  //     <div>
  //       {info && this.renderInfo()}
  //       {tip && this.renderTip()}
  //     </div>
  //   )
  // }

  // public renderInfo() {
  //   const info = this.state.info!
  //   const { amount, receiver } = this.state

  //   return (
  //     <div>
  //       <p>Address: {info.addStr}</p>
  //       <p>
  //         Balance: {info.balance} QTUM
  //         <button onClick={this.handleRefresh}>Refresh</button>
  //       </p>
  //       <p>Pending txs: {info.unconfirmedTxApperances}</p>
  //       <p>Send to address:</p>
  //       <input type="text" onChange={this.handleReceiverChange} value={receiver}/>
  //       <p>Amount:</p>
  //       <input type="number" onChange={this.handleAmountChange} value={amount} />
  //       <button onClick={this.handleSendTo} disabled={!(amount && receiver)}>send!</button>
  //     </div>
  //   )
  // }

  // public renderTip() {
  //   const tip = this.state.tip!

  //   return (
  //     <p>{tip}</p>
  //   )
  // }

  // private handleAmountChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  //   const value = event.target.value
  //   this.setState({ amount: value ? parseFloat(value) : 0 })
  // }

  // private handleReceiverChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  //   this.setState({ receiver: event.target.value })
  // }

  // private handleRefresh = () => {
  //   this.setState({ tip: 'refreshing balance...' })
  //   // this.getWalletInfo()
  // }

  // private handleSendTo =  async () => {
  //   this.setState({ tip: 'sending...'})

  //   const { receiver, amount } = this.state

  //   const wallet = this.state.wallet!

  //   try {
  //     await wallet.send(receiver, amount * 1e8, {
  //       feeRate: 4000,
  //     })

  //     this.setState({ tip: 'done' })
  //   } catch (err) {
  //     console.log(err)
  //     this.setState({ tip: err.message })
  //   }

  // }

  // private async getWalletInfo() {
  //   const wallet = this.state.wallet!
  //   const info = await wallet.getInfo()
  //   this.setState({info, tip: ''})
  // }

  // private handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
  //   this.setState({ mnemonic: event.target.value })
  // }

  // private handleRecover: React.MouseEventHandler<HTMLButtonElement> = () => {
  //   this.setState({ wallet: undefined, receiver: '', amount: 0, tip: '' })

  //   const { mnemonic } = this.state

  //   try {
  //     const wallet = recoverWallet(mnemonic)
  //     chrome.storage.local.set({ mnemonic })
  //     this.setState({wallet})
  //     this.getWalletInfo()
  //   } catch (err) {
  //     console.log('cannot set mnemonic', err)
  //   }
  // }
}

interface IProps {
  port: chrome.runtime.Port
}

// interface IState {
//   mnemonic: string
//   wallet?: Wallet
//   info?: Insight.IGetInfo
//   receiver: string
//   amount: number
//   tip: string
// }

export default App
