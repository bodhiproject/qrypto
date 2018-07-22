import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
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
import Logo from '../../components/Logo';
import AppStore from '../../../stores/AppStore';
import { MESSAGE_TYPE } from '../../../constants';

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
    const { matchError, error } = loginStore;
    const { hasAccounts } = walletStore;

    return (
      <div className={classes.root}>
        <Logo />
        <div className={classes.fieldContainer}>
          <PasswordInput
            classNames={classes.passwordField}
            autoFocus={true}
            placeholder="Password"
            onChange={(e: any) => loginStore.password = e.target.value}
            onEnterPress={this.login}
          />
          {!hasAccounts && (
            <Fragment>
              <PasswordInput
                classNames={classes.passwordField}
                placeholder="Confirm password"
                error={!!matchError}
                errorText={matchError}
                onChange={(e: any) => loginStore.confirmPassword = e.target.value}
                onEnterPress={this.login}
              />
              <Typography className={classes.masterPwNote}>
                This will serve as your master password and will be saved when you create or import your first wallet.
              </Typography>
            </Fragment>
          )}
        </div>
        <Button
          className={classes.loginButton}
          fullWidth
          variant="contained"
          color="primary"
          disabled={error}
          onClick={this.login}
        >
          Login
        </Button>
        <ErrorDialog {...this.props} />
      </div>
    );
  }

  private login = () => {
    const { history, store: { loginStore } }: any = this.props;
    if (loginStore.error === false) {
      history.push('/loading');
      chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGIN, password: loginStore.password });
    }
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

export default withRouter<any>(withStyles(styles)(Login));
