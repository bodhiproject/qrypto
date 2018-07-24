import React, { Component } from 'react';
import { Paper, Select, MenuItem, Typography, Button, withStyles, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';
import AppStore from '../../stores/AppStore';

interface IProps {
  classes: Record<string, string>;
  store: AppStore;
}

@inject('store')
@observer
class AccountLogin extends Component<WithStyles & IProps, {}> {

  public componentDidMount() {
    this.props.store.accountLoginStore.getAccounts();
  }

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Paper className={classes.headerContainer}>
          <NavBar hasNetworkSelector isDarkTheme title="Account Login" />
          <AccountSection {...this.props} />
        </Paper>
        <PermissionSection {...this.props} />
        <LoginSection {...this.props} />
      </div>
    );
  }
}

const AccountSection = observer(({ classes, store: { accountLoginStore } }: any) => (
  <div className={classes.accountContainer}>
    <Typography className={classes.selectAcctText}>Select account</Typography>
    <Select
      disableUnderline
      className={classes.accountSelect}
      name="accounts"
      value={accountLoginStore.selectedWalletName}
      onChange={(e) => accountLoginStore.selectedWalletName = e.target.value}
    >
      {accountLoginStore.accounts.map((acct: Account, index: number) =>
        <MenuItem key={index} value={acct.name}>{acct.name}</MenuItem>)
      }
    </Select>
    <div className={classes.createAccountContainer}>
      <Typography className={classes.orText}>or</Typography>
      <Button className={classes.createAccountButton} color="secondary" onClick={accountLoginStore.routeToCreateWallet}>
        Create New Wallet
      </Button>
    </div>
  </div>
));

const PermissionSection = ({ classes }: any) => (
  <div className={classes.permissionContainer}>
    {/* <Typography className={classes.permissionsHeader}>Permissions</Typography> */}
  </div>
);

const LoginSection = observer(({ classes, store: { accountLoginStore } }: any) => (
  <div className={classes.loginContainer}>
    <Button
      className={classes.loginButton}
      fullWidth
      variant="contained"
      color="primary"
      onClick={accountLoginStore.loginAccount}
    >
      Login
    </Button>
  </div>
));

export default withStyles(styles)(AccountLogin);
