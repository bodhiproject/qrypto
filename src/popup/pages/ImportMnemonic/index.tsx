import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Typography, TextField, Button, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import styles from './styles';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class ImportMnemonic extends Component<{}, IState> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public recoverAndGoToHomePage = () => {
    const { store: { walletStore }, history } = this.props;
    walletStore.loading = true;
    setTimeout(() => {
      walletStore.onImportNewMnemonic();
      history.push('/');
    }, 100);
  }

  public componentDidMount() {
    this.props.store.walletStore.stopGetInfoPolling();
  }

  public render() {
    const { classes, history, store: { walletStore } } = this.props;

    // Route to home page if mnemonic is found in storage
    if (!_.isEmpty(walletStore.mnemonic)) {
      history.push('/');
    }

    return (
      <div className={classes.root}>
        <div className={classes.inputContainer}>
          <Typography className={classes.importHeading}>Import Mnemonic</Typography>
          <TextField
            className={classes.mnemonicTextField}
            autoFocus
            required
            fullWidth
            multiline
            rows={4}
            type="text"
            placeholder="Enter your seed phrase here to import."
            onChange={(e) => walletStore.enteredMnemonic = e.target.value}
            error={_.isEmpty(walletStore.enteredMnemonic)}
            InputProps={{
              disableUnderline: true,
              classes: { input: classes.mnemonicFieldInput },
            }}
          />
          <PasswordTextField placeholder="Password" />
          <PasswordTextField placeholder="Confirm password" />
        </div>
        <div>
          <Button
            className={classes.importButton}
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.recoverAndGoToHomePage}
            disabled={_.isEmpty(walletStore.enteredMnemonic)}
          >
            Import
          </Button>
          <Button className={classes.cancelButton} fullWidth color="primary">Cancel</Button>
        </div>
      </div>
    );
  }
}

const PasswordTextField = withStyles(styles, { withTheme: true })(({ classes, placeholder }: any) => (
  <TextField
    className={classes.passwordTextField}
    required
    fullWidth
    type="password"
    placeholder={placeholder}
    InputProps={{
      disableUnderline: true,
      classes: { input: classes.passwordFieldInput },
    }}
  />
));

interface IState {
  walletStore: any;
  history: any;
}
