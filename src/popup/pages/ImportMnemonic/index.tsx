import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Typography, TextField, Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

@withRouter
@inject('store')
@observer
export default class ImportMnemonic extends Component<{}, IState> {

  public componentDidMount() {
    this.props.store.walletStore.stopGetInfoPolling();
  }

  public render() {
    const { history, store: { walletStore } } = this.props;

    // Route to home page if mnemonic is found in storage
    if (!_.isEmpty(walletStore.mnemonic)) {
      history.push('/');
    }

    return(
      <div style={{ margin: 16 }}>
        <Typography variant="title" style={{ marginBottom: 16 }}>Enter Your Wallet Mnemonic</Typography>
        <TextField
          autoFocus
          fullWidth
          required
          style={{ marginBottom: 16 }}
          onChange={(e) => walletStore.enteredMnemonic = e.target.value}
          error={_.isEmpty(walletStore.enteredMnemonic)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={this.recoverAndGoToHomePage}
          disabled={_.isEmpty(walletStore.enteredMnemonic)}
        >
          Import Wallet
        </Button>
      </div>
    );
  }

  public recoverAndGoToHomePage = () => {
    const { store: { walletStore }, history } = this.props;
    walletStore.loading = true;
    setTimeout(() => {
      walletStore.onImportNewMnemonic();
      history.push('/');
    }, 100);
  }
}

interface IState {
  walletStore: any;
  history: any;
}
