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

  public componentDidMount() {
    this.props.store.walletStore.stopGetInfoPolling();
  }

  public render() {
    const { classes, history, store: { walletStore } } = this.props;

    // Route to home page if mnemonic is found in storage
    if (!_.isEmpty(walletStore.mnemonic)) {
      history.push('/');
    }

    const error = this.getPasswordMatchError();

    return (
      <div className={classes.root}>
        <NavBar hasNetworkSelector title="" />
        <div className={classes.contentContainer}>
          <Typography className={classes.headerText}>Import Mnemonic</Typography>
          <div className={classes.inputContainer}>
            <div className={classes.fieldContainer}>
              <TextField
                className={classes.mnemonicTextField}
                autoFocus
                required
                multiline
                rows={5}
                type="text"
                placeholder="Enter your seed phrase here to import."
                onChange={(e) => walletStore.enteredMnemonic = e.target.value}
                error={_.isEmpty(walletStore.enteredMnemonic)}
                InputProps={{
                  disableUnderline: true,
                  classes: { input: classes.mnemonicFieldInput },
                }}
              />
              <PasswordInput
                classNames={classes.passwordField}
                placeholder="Password"
                onChange={(e: any) => walletStore.password = e.target.value}
              />
              <PasswordInput
                classNames={classes.passwordField}
                placeholder="Confirm password"
                helperText={error}
                error={error}
                onChange={(e: any) => walletStore.confirmPassword = e.target.value}
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
                _.isEmpty(walletStore.enteredMnemonic)
                  || _.isEmpty(walletStore.password)
                  || _.isEmpty(walletStore.confirmPassword)
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
    const { password, confirmPassword } = this.props.store.walletStore;

    let error;
    if (!_.isEmpty(password) && !_.isEmpty(confirmPassword) && password !== confirmPassword) {
      error = 'Passwords do not match.';
    }
    return error;
  }

  private recoverAndGoToHomePage = () => {
    const { store: { walletStore }, history } = this.props;
    
    walletStore.loading = true;
    setTimeout(() => {
      walletStore.onImportNewMnemonic();
      history.push('/');
    }, 100);
  }

  private onCancelClick = () => {
    const { store: { walletStore }, history } = this.props;

    walletStore.enteredMnemonic = '';
    walletStore.password = '';
    walletStore.confirmPassword = '';
    history.goBack();
  }
}

interface IState {
  walletStore: any;
  history: any;
}
