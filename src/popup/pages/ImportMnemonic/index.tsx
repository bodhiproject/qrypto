import React, { Component } from 'react';
import { Typography, TextField, Button, withStyles, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';
import BorderTextField from '../../components/BorderTextField';
import AppStore from '../../../stores/AppStore';

interface IProps {
  classes: Record<string, string>;
  store: AppStore;
}

interface IState {
  importStore: any;
  walletStore: any;
}

@inject('store')
@observer
class ImportMnemonic extends Component<WithStyles & IProps, IState> {
  public componentWillUnmount() {
    this.props.store.importStore.reset();
  }

  public componentDidMount() {
    this.props.store.walletStore.stopPolling();
  }

  public render() {
    const { classes, store: { importStore } }: any = this.props;

    return (
      <div className={classes.root}>
        <NavBar hasNetworkSelector title="" />
        <div className={classes.contentContainer}>
          <Typography className={classes.headerText}>Import Wallet</Typography>
          <div className={classes.inputContainer}>
            <div className={classes.fieldContainer}>
              <TextField
                className={classes.mnemonicTextField}
                autoFocus
                required
                multiline
                rows={5}
                type="text"
                placeholder="Enter your seed phrase here to import your wallet."
                onChange={(e) => importStore.mnemonic = e.target.value}
                InputProps={{
                  disableUnderline: true,
                  classes: { input: classes.mnemonicFieldInput },
                }}
              />
              <BorderTextField
                placeholder="Wallet name"
                onChange={(e: any) => importStore.accountName = e.target.value}
              />
            </div>
          </div>
          <div>
            <Button
              className={classes.importButton}
              fullWidth
              variant="contained"
              color="primary"
              onClick={importStore.importNewMnemonic}
              disabled={importStore.error}
            >
              Import
            </Button>
            <Button
              className={classes.cancelButton}
              fullWidth
              color="primary"
              onClick={importStore.cancelImport}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ImportMnemonic);
