import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Typography, Button, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';

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

  public onImportWalletClick = () => {
    this.props.history.push('/import-mnemonic');
  }

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <NavBar hasNetworkSelector title="" />
        <div className={classes.contentContainer}>
          <div className={classes.logoContainerOuter}>
            <Typography className={classes.logoText}>Qrypto</Typography>
            <Typography className={classes.logoDesc}>Create your Qrypto wallet</Typography>
          </div>
          <div className={classes.fieldContainer}>
            <PasswordInput classNames={classes.passwordField} placeholder="Password" />
            <PasswordInput classNames={classes.confirmPasswordField} placeholder="Confirm password" />
          </div>
          <Button
            className={cx(classes.button, 'marginBottom')}
            fullWidth
            variant="contained"
            color="primary"
          >
            Login
          </Button>
          <Button
            className={classes.button}
            fullWidth
            color="primary"
            onClick={this.onImportWalletClick}
          >
            Import Existing Wallet
          </Button>
        </div>
      </div>
    );
  }
}
