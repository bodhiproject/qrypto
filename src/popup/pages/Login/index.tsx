import React, { Component } from 'react';
import { Typography, Button, withStyles, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import PasswordInput from '../../components/PasswordInput';
import AppStore from '../../../stores/AppStore';

interface IProps {
  classes: Record<string, string>;
  store: AppStore;
}

@inject('store')
@observer
class Login extends Component<WithStyles & IProps, {}> {
  public componentWillUnmount() {
    this.props.store.createWalletStore.reset();
  }

  public render() {
    const { classes, store: { createWalletStore } } = this.props;
    const matchError = createWalletStore.matchError;

    return (
      <div className={classes.root}>
        <div className={classes.contentContainer}>
          <div className={classes.logoContainerOuter}>
            <Typography className={classes.logoText}>Qrypto</Typography>
          </div>
          <div className={classes.fieldContainer}>
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
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
