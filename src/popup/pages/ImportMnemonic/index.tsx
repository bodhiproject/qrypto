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
    const { history } = this.props;
    const { mnemonic } = this.props.store.walletStore;

    // Route to home page if mnemonic is found in storage
    if (!_.isEmpty(mnemonic)) {
      history.push('/');
    }

    return(
      <div style={{ margin: 16 }}>
        <Typography variant="title" style={{ marginBottom: 16 }}>Enter Your Wallet Mnemonic</Typography>
        <TextField
          autoFocus
          fullWidth
          required
          label="Mnemonic"
          value={mnemonic}
          style={{ marginBottom: 16 }}
          onChange={(e) => mnemonic = e.target.value}
          error={_.isEmpty(mnemonic)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={this.recoverAndGoToHomePage}
          disabled={_.isEmpty(mnemonic)}
        >
          Import Wallet
        </Button>
      </div>  
    )
  }

  public recoverAndGoToHomePage = () => {
    const { store: { walletStore }, history } = this.props;

    walletStore.handleRecover();
    history.push('/');
  }
}

interface IState {
  walletStore: any
  history: any
}
