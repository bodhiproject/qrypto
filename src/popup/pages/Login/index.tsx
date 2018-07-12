import React, { Component } from 'react';
import { Typography, Button, withStyles, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import PasswordInput from '../../components/PasswordInput';
import AppStore from '../../../stores/AppStore';
import qryptoLogo from '../../../../static/images/qrypto_logo_128.png';

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
    const { classes, store: { loginStore } } = this.props;
    const { hasAppSalt, matchError, error } = loginStore;

    return (
      <div className={classes.root}>
        <div className={classes.logoContainer}>
          <img className={classes.logo} src={qryptoLogo} alt={'Logo'} />
          <Typography className={classes.logoText}>Qrypto</Typography>
        </div>
        <div className={classes.fieldContainer}>
          <PasswordInput
            classNames={classes.passwordField}
            placeholder="Password"
            onChange={this.onPasswordChange}
          />
          {!hasAppSalt && (
            <PasswordInput
              classNames={classes.confirmPasswordField}
              placeholder="Confirm password"
              helperText={matchError}
              error={!!matchError}
              onChange={(e: any) => loginStore.confirmPassword = e.target.value}
            />
          )}
        </div>
        <Button
          className={classes.loginButton}
          fullWidth
          variant="contained"
          color="primary"
          disabled={error}
          onClick={loginStore.routeToSaveMnemonic}
        >
          Login
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
