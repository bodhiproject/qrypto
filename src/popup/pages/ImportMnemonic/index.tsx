import React, { Component } from 'react'
import { networks, Wallet, Insight} from 'qtumjs-wallet'
import { Redirect, withRouter } from "react-router-dom";
import { Typography, TextField, Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

@withRouter
@inject('store')
@observer
export default class ImportMnemonic extends Component<{}, IState> {

  public render(){ 
    console.log("render props:", this.props)
    const { walletStore } = this.props.store

    return(
      <div style={{ margin: 16 }}>
        <Typography variant="title" style={{ marginBottom: 16 }}>Enter Your Wallet Mnemonic</Typography>
        <TextField
          autofocus
          fullWidth
          required
          label="Mnemonic"
          value={walletStore.mnemonic}
          style={{ marginBottom: 16 }}
          onChange={(e) => walletStore.mnemonic = e.target.value}
          error={_.isEmpty(walletStore.mnemonic)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={this.recoverAndGoToHomePage}
          disabled={_.isEmpty(walletStore.mnemonic)}
        >
          Import Wallet
        </Button>
      </div>  
    )
  }

  public recoverAndGoToHomePage = () => {
    const { store: { walletStore }, history } = this.props

    walletStore.handleRecover()
    history.push('/')
  }
}

interface IState {
  walletStore: any
  history: any
}
