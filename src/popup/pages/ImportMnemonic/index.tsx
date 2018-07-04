import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { TextField, Button, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import cx from 'classnames';

import styles from './styles';
import NavBar from '../../components/NavBar';
import PasswordInput from '../../components/PasswordInput';

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
        <NavBar hasNetworkSelector title="Import Mnemonic" />
        <div className={classes.contentContainer}>
          <div className={classes.inputContainer}>
            <div className={classes.fieldContainer}>
              <TextField
                className={classes.mnemonicTextField}
                autoFocus
                required
                multiline
                rows={5}
                type="text"
                placeholder="Enter your seed phrase here to import."
                onChange={(e) => walletStore.enteredMnemonic = e.target.value}
                error={_.isEmpty(walletStore.enteredMnemonic)}
                InputProps={{
                  disableUnderline: true,
                  classes: { input: classes.mnemonicFieldInput },
                }}
              />
              <PasswordInput placeholder="Password" />
              <PasswordInput placeholder="Confirm password" />
            </div>
          </div>
          <div>
            <Button
              className={cx(classes.button, 'marginBottom')}
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.recoverAndGoToHomePage}
              disabled={_.isEmpty(walletStore.enteredMnemonic)}
            >
              Import
            </Button>
            <Button className={classes.button} fullWidth color="primary">Cancel</Button>
          </div>
        </div>
      </div>
    );
  }
}

interface IState {
  walletStore: any;
  history: any;
}
