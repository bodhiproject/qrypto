import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Typography, Button, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import styles from './styles';
import NavBar from '../../components/NavBar';
import PasswordInput from '../../components/PasswordInput';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class Login extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public componentWillUnmount() {
    this.props.store.loginStore.reset();
  }

  public render() {
    const { classes, store: { loginStore } } = this.props;
    const error = this.getPasswordMatchError();

    return (
      <div className={classes.root}>
        <NavBar hasNetworkSelector title="" />
        <div className={classes.contentContainer}>
          <div className={classes.logoContainerOuter}>
            <Typography className={classes.logoText}>Qrypto</Typography>
            <Typography className={classes.logoDesc}>Create your Qrypto wallet</Typography>
          </div>
          <div className={classes.fieldContainer}>
            <PasswordInput
              classNames={classes.passwordField}
              placeholder="Password"
              onChange={(e: any) => loginStore.password = e.target.value}
            />
            <PasswordInput
              classNames={classes.confirmPasswordField}
              placeholder="Confirm password"
              helperText={error}
              error={error}
              onChange={(e: any) => loginStore.confirmPassword = e.target.value}
            />
          </div>
          <Button
            className={classes.loginButton}
            fullWidth
            variant="contained"
            color="primary"
            disabled={_.isEmpty(loginStore.password) || _.isEmpty(loginStore.confirmPassword) || error}
          >
            Create Wallet
          </Button>
          <Button
            className={classes.importButton}
            fullWidth
            disableRipple
            color="primary"
            onClick={this.onImportWalletClick}
          >
            Import Existing Wallet
          </Button>
        </div>
      </div>
    );
  }

  private getPasswordMatchError = () => {
    const { password, confirmPassword } = this.props.store.loginStore;

    let error;
    if (!_.isEmpty(password) && !_.isEmpty(confirmPassword) && password !== confirmPassword) {
      error = 'Passwords do not match.';
    }
    return error;
  }

  private onImportWalletClick = () => {
    this.props.history.push('/import-mnemonic');
  }
}
