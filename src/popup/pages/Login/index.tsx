import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Paper, Select, MenuItem, Typography, Button, withStyles } from '@material-ui/core';
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
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.headerContainer}>
          <NavBar hasNetworkSelector isDarkTheme title="Login" />
          <AccountSection {...this.props} />
        </Paper>
        <PermissionSection {...this.props} />
        <LoginSection {...this.props} />
      </div>
    );
  }
}

const AccountSection = ({ classes, history, store: { walletStore: { accounts } } }: any) => (
  <div className={classes.accountContainer}>
    <Typography className={classes.selectAcctText}>Select account</Typography>
    <Select disableUnderline className={classes.accountSelect} name="accounts" value={accounts[0].name}>
      {accounts.map((acct: Account, index: number) => <MenuItem key={index} value={acct.name}>{acct.name}</MenuItem>)}
    </Select>
    <div className={classes.createAccountContainer}>
      <Typography className={classes.orText}>or</Typography>
      <Button className={classes.createAccountButton} color="secondary" onClick={() => history.push('/import')}>
        Import Wallet
      </Button>
    </div>
  </div>
);

const PermissionSection = ({ classes }: any) => (
  <div className={classes.permissionContainer}>
    <Typography className={classes.permissionsHeader}>Permissions</Typography>
  </div>
);

const LoginSection = observer(({ classes, history, store: { loginStore } }: any) => (
  <div className={classes.loginContainer}>
    <PasswordInput
      classNames={classes.passwordField}
      placeholder="Password"
      onChange={(e: any) => loginStore.password = e.target.value}
    />
    <Button
      className={classes.loginButton}
      fullWidth
      variant="contained"
      color="primary"
      disabled={_.isEmpty(loginStore.password)}
      onClick={() => history.push('/home')}
    >
      Login
    </Button>
  </div>
));
