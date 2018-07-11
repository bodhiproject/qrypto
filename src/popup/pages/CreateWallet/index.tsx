import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, Button, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';
import BorderTextField from '../../components/BorderTextField';
import PasswordInput from '../../components/PasswordInput';

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class CreateWallet extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public componentWillUnmount() {
    this.props.store.createWalletStore.reset();
  }

  public render() {
    const { classes, store: { createWalletStore } } = this.props;
    const matchError = createWalletStore.matchError;

    return (
      <div className={classes.root}>
        <NavBar hasBackButton={createWalletStore.showBackButton} hasNetworkSelector title="" />
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
              error={!!matchError}
              onChange={(e: any) => createWalletStore.confirmPassword = e.target.value}
            />
          </div>
          <Button
            className={classes.loginButton}
            fullWidth
            variant="contained"
            color="primary"
            disabled={createWalletStore.error}
            onClick={createWalletStore.routeToSaveMnemonic}
          >
            Create Wallet
          </Button>
          <Button
            className={classes.importButton}
            fullWidth
            disableRipple
            color="primary"
            onClick={createWalletStore.routeToImportWallet}
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
