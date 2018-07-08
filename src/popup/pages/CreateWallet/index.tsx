import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Typography, Button, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { isEmpty } from 'lodash';

import styles from './styles';
import NavBar from '../../components/NavBar';
import BorderTextField from '../../components/BorderTextField';
import PasswordInput from '../../components/PasswordInput';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class CreateWallet extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public componentDidMount() {
    const { history, store: { createWalletStore, walletStore } } = this.props;

    // Route to home page if mnemonic is found in storage
    if (createWalletStore.rerouteToLogin && !isEmpty(walletStore.accounts)) {
      history.push('/login');
    }
  }

  public componentWillUnmount() {
    this.props.store.createWalletStore.reset();
  }

  public render() {
    const { classes, store: { createWalletStore } } = this.props;
    const matchError = createWalletStore.matchError;

    return (
      <div className={classes.root}>
        <NavBar hasBackButton={!createWalletStore.rerouteToLogin} hasNetworkSelector title="" />
        <div className={classes.contentContainer}>
          <div className={classes.logoContainerOuter}>
            <Typography className={classes.logoText}>Qrypto</Typography>
            <Typography className={classes.logoDesc}>Create your Qrypto wallet</Typography>
          </div>
          <div className={classes.fieldContainer}>
            <BorderTextField
              classNames={classes.walletNameField}
              placeholder="Wallet name"
              onChange={this.onWalletNameChange}
            />
            <PasswordInput
              classNames={classes.passwordField}
              placeholder="Password"
              onChange={this.onPasswordChange}
            />
            <PasswordInput
              classNames={classes.confirmPasswordField}
              placeholder="Confirm password"
              helperText={matchError}
              error={matchError}
              onChange={(e: any) => createWalletStore.confirmPassword = e.target.value}
            />
          </div>
          <Button
            className={classes.loginButton}
            fullWidth
            variant="contained"
            color="primary"
            disabled={createWalletStore.error}
            onClick={() => this.props.history.push('/save-mnemonic')}
          >
            Create Wallet
          </Button>
          <Button
            className={classes.importButton}
            fullWidth
            disableRipple
            color="primary"
            onClick={() => this.props.history.push('/import')}
          >
            Import Existing Wallet
          </Button>
        </div>
      </div>
    );
  }

  private onWalletNameChange = (event: any) => {
    const { createWalletStore, saveMnemonicStore } = this.props.store;
    createWalletStore.walletName = event.target.value;
    saveMnemonicStore.walletName = event.target.value;
  }

  private onPasswordChange = (event: any) => {
    const { createWalletStore, saveMnemonicStore } = this.props.store;
    createWalletStore.password = event.target.value;
    saveMnemonicStore.password = event.target.value;
  }
}
