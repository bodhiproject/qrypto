import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Paper, Select, MenuItem, Typography, Button, withStyles, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';
import AppStore from '../../../stores/AppStore';
import { MESSAGE_TYPE } from '../../../constants';

interface IProps {
  classes: Record<string, string>;
  store: AppStore;
}

@inject('store')
@observer
class AccountLogin extends Component<WithStyles & IProps, {}> {
  public componentDidMount() {
    this.props.store.accountLoginStore.setSelectedWallet();
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

const AccountSection = observer(({ classes, store: { walletStore: { accounts }, accountLoginStore } }: any) => (
  <div className={classes.accountContainer}>
    <Typography className={classes.selectAcctText}>Select account</Typography>
    <Select
      disableUnderline
      className={classes.accountSelect}
      name="accounts"
      value={accountLoginStore.selectedWalletName}
      onChange={(e) => accountLoginStore.selectedWalletName = e.target.value}
    >
      {accounts.map((acct: Account, index: number) => <MenuItem key={index} value={acct.name}>{acct.name}</MenuItem>)}
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

const LoginSection = observer(withRouter(({ history, classes, store: { accountLoginStore } }: any) => (
  <div className={classes.loginContainer}>
    <Button
      className={classes.loginButton}
      fullWidth
      variant="contained"
      color="primary"
      onClick={() => {
        history.push('/loading');
        chrome.runtime.sendMessage({
          type: MESSAGE_TYPE.ACCOUNT_LOGIN,
          selectedWalletName: accountLoginStore.selectedWalletName,
        });
      }}
    >
      Login
    </Button>
  </div>
)));

export default withStyles(styles)(AccountLogin);
