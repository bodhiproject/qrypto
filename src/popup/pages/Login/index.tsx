import React, { Component } from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  withStyles,
  WithStyles,
} from '@material-ui/core';
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
          onClick={() => walletStore.login(password)}
        >
          Login
        </Button>
        <ErrorDialog {...this.props} />
      </div>
    );
  }
}

const ErrorDialog: React.SFC<any> = observer(({ store: { loginStore }}: any) => (
  <Dialog
    disableBackdropClick
    open={!!loginStore.invalidPassword}
    onClose={() => loginStore.invalidPassword = undefined}
  >
    <DialogTitle>Invalid Password</DialogTitle>
    <DialogContent>
      <DialogContentText>You have entered an invalid password. Please try again.</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => loginStore.invalidPassword = undefined} color="primary">Close</Button>
    </DialogActions>
  </Dialog>
));

export default withStyles(styles)(Login);
