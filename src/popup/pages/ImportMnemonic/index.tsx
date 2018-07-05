import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Typography, TextField, Button, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import styles from './styles';
import NavBar from '../../components/NavBar';
import PasswordInput from '../../components/PasswordInput';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class ImportMnemonic extends Component<{}, IState> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public componentWillUnmount() {
    this.props.store.importStore.reset();
  }

  public render() {
    const { classes, store: { importStore } }: any = this.props;
    const error = this.getPasswordMatchError();

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
                onChange={(e) => importStore.enteredMnemonic = e.target.value}
                error={_.isEmpty(importStore.enteredMnemonic)}
                InputProps={{
                  disableUnderline: true,
                  classes: { input: classes.mnemonicFieldInput },
                }}
              />
              <PasswordInput
                classNames={classes.passwordField}
                placeholder="Password"
                onChange={(e: any) => importStore.password = e.target.value}
              />
              <PasswordInput
                classNames={classes.passwordField}
                placeholder="Confirm password"
                helperText={error}
                error={error}
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
              onClick={this.recoverAndGoToHomePage}
              disabled={
                _.isEmpty(importStore.enteredMnemonic)
                  || _.isEmpty(importStore.password)
                  || _.isEmpty(importStore.confirmPassword)
                  || error
              }
            >
              Import
            </Button>
            <Button
              className={classes.cancelButton}
              fullWidth
              color="primary"
              onClick={this.onCancelClick}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  private getPasswordMatchError = () => {
    const { password, confirmPassword } = this.props.store.importStore;

    let error;
    if (!_.isEmpty(password) && !_.isEmpty(confirmPassword) && password !== confirmPassword) {
      error = 'Passwords do not match.';
    }
    return error;
  }

  private recoverAndGoToHomePage = () => {
    const { store: { walletStore, importStore }, history }: any = this.props;
    const { enteredMnemonic } = importStore;

    walletStore.loading = true;
    setTimeout(() => {
      importStore.onImportNewMnemonic(enteredMnemonic);
      history.push('/home');
    }, 100);
  }

  private onCancelClick = () => {
    const { store: { importStore }, history }: any = this.props;

    importStore.reset();
    history.goBack();
  }
}

interface IState {
  importStore: any;
  walletStore: any;
  history: any;
}
