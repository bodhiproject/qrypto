import React, { Component } from 'react';
import { Typography, Button, withStyles, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import PasswordInput from '../../components/PasswordInput';
import AppStore from '../../../stores/AppStore';
import logo from '../../../images/logo.png';

interface IProps {
  classes: Record<string, string>;
  store: AppStore;
}

@inject('store')
@observer
class Login extends Component<WithStyles & IProps, {}> {
  public componentDidMount() {
    this.props.store.loginStore.init();
  }

  public render() {
    const { classes, store: { loginStore, walletStore } } = this.props;
    const { password, matchError, error } = loginStore;
    const { appSalt } = walletStore;

    return (
      <div className={classes.root}>
        <div className={classes.logoContainer}>
          <img className={classes.logo} src={logo} alt={'Logo'} />
          <Typography className={classes.logoText}>Qrypto</Typography>
        </div>
        <div className={classes.fieldContainer}>
          <PasswordInput
            classNames={classes.passwordField}
            placeholder="Password"
            onChange={(e: any) => loginStore.password = e.target.value}
          />
          {!appSalt && (
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
          onClick={() => walletStore.newLogin(password)}
        >
          Login
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Login);
