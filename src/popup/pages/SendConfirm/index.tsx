import React, { Component } from 'react';
import Button from '@material-ui/core/Button'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { NavBar } from '../../components/NavBar'

@withRouter
@inject('store')
@observer
export default class Send extends Component<any, {}> {
  handleCancel = () => {
    this.props.history.push('/send')
  }

  handleConfirm = () => {
    this.props.store.walletStore.send()
    //TODO? UI decision - do we want to stay on the page after the transaction has been confirmed?
    // this.props.history.push('/account-detail')
  }

  componentDidMount() {
    this.props.store.ui.prevLocation = '/send'
  }
  
  public render(){
    const { walletStore } = this.props.store
    const { info, sendToAddress, sendToAmount, tip } = walletStore

    return(
      <div>
        <NavBar hasBackButton={true} title={'Send Confirm Page'} />
        <h6>Sub-address 01</h6>
        <p>From: {info.addrStr}</p>
        <p>To: {sendToAddress}</p>
        <p>Amount: {sendToAmount} QTUM</p>
        <p>Gas Limit {`<GAS LIMIT>`} UNITS</p>
        <p>Gas Price {`<GAS PRICE>`} GWEI</p>
        <p>Max Transaction Fee {`<MAX TRX FEE 0.000489>`} QTUM</p>
        <Button variant="contained" color="primary" onClick={this.handleCancel}>
          CANCEL
        </Button>
        <Button variant="contained" color="primary" onClick={this.handleConfirm}>
          CONFIRM
        </Button>
        {tip}
      </div>
    )
  }
}