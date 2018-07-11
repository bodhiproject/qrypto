import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, TextField, Button, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';
import BorderTextField from '../../components/BorderTextField';
import PasswordInput from '../../components/PasswordInput';

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class ImportMnemonic extends Component<{}, IState> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public componentWillUnmount() {
    this.props.store.importStore.reset();
  }

  public componentDidMount() {
    this.props.store.walletStore.stopPolling();
  }

  public render() {
    const { classes, store: { importStore } }: any = this.props;
    const matchError = importStore.matchError;

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
                rows={4}
                type="text"
                placeholder="Enter your seed phrase here to import your wallet."
                onChange={(e) => importStore.mnemonic = e.target.value}
                InputProps={{
                  disableUnderline: true,
                  classes: { input: classes.mnemonicFieldInput },
                }}
              />
              <BorderTextField
                classNames={classes.accountNameField}
                placeholder="Wallet name"
                onChange={(e: any) => importStore.accountName = e.target.value}
              />
              <PasswordInput
                classNames={classes.passwordField}
                placeholder="Password"
                onChange={(e: any) => importStore.password = e.target.value}
              />
              <PasswordInput
                classNames={classes.passwordField}
                placeholder="Confirm password"
                helperText={matchError}
                error={!!matchError}
                onChange={(e: any) => importStore.confirmPassword = e.target.value}
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

interface IState {
  importStore: any;
  walletStore: any;
}
