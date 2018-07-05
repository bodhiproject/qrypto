import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Paper, Select, MenuItem, Typography, Button, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';

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
    const { classes, store: { walletStore } } = this.props;

    return (
      <div className={classes.root}>
        <NavBar hasNetworkSelector isDarkTheme title="Login" />
        <Paper className={classes.accountContainer}>
          <Typography className={classes.selectAcctText}>Select account</Typography>
          <AccountSelect accounts={walletStore.accounts} />
          <div className={classes.createAccountContainer}>
            <Typography className={classes.orText}>or</Typography>
            <Button
              className={classes.createAccountButton}
              disableRipple
              color="secondary"
            >
              Create New Account
            </Button>
          </div>
        </Paper>
      </div>
    );
  }
}

const AccountSelect = withStyles(styles, { withTheme: true })(({ classes, accounts }: any) => (
  <Select className={classes.selectEmpty} name="accounts">
    {accounts.map((acct: Account) => <MenuItem value={acct.name}>{acct.name}</MenuItem>)}
  </Select>
));
