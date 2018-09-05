import React, { Component } from 'react';
import { Typography, Button, withStyles, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';

import styles from './styles';
import NavBar from '../../components/NavBar';
import AppStore from '../../stores/AppStore';
const strings = require('../../localization/locales/en_US.json');

interface IProps {
  classes: Record<string, string>;
  store: AppStore;
}

@inject('store')
@observer
class SaveMnemonic extends Component<WithStyles & IProps, {}> {
  public componentDidMount() {
    this.props.store.saveMnemonicStore.generateMnemonic();
  }

  public render() {
    const { classes, store: { saveMnemonicStore } } = this.props;

    return (
      <div className={classes.root}>
        <NavBar hasBackButton title={''} />
        <div className={classes.contentContainer}>
          <div className={classes.topContainer}>
            <Typography className={classes.walletCreatedHeader}>{strings['saveMnemonic.walletCreated']}</Typography>
            <Typography className={classes.mnemonicText}>{saveMnemonicStore.mnemonic}</Typography>
            <Typography className={classes.warningText}>{strings['saveMnemonic.warningText']}</Typography>
          </div>
          <Button
              className={cx(classes.actionButton, 'marginBottom')}
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => saveMnemonicStore.createWallet(false)}
            >
              I Copied It Somewhere Safe
            </Button>
            <Button
              className={classes.actionButton}
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => saveMnemonicStore.createWallet(true)}
            >
              Save To File
            </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(SaveMnemonic);
