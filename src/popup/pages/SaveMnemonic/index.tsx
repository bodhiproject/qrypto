import React, { Component } from 'react';
import { Typography, Button, withStyles, WithStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';

import styles from './styles';
import NavBar from '../../components/NavBar';
import AppStore from '../../../stores/AppStore';

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
        <NavBar hasBackButton title="Wallet Created" />
        <div className={classes.contentContainer}>
          {/* tslint:disable-next-line:max-line-length */}
          <Typography className={classes.warningText}>These words in this specific order are the only way to restore your wallet. Save them somewhere safe and don't share them with anyone!</Typography>
          <Typography className={classes.mnemonicText}>{saveMnemonicStore.mnemonic}</Typography>
          <Button
              className={cx(classes.actionButton, 'marginBottom')}
              fullWidth
              variant="contained"
              color="primary"
              onClick={saveMnemonicStore.createWallet}
            >
              I Copied It Somewhere Safe
            </Button>
            <Button
              className={classes.actionButton}
              fullWidth
              variant="contained"
              color="secondary"
              onClick={saveMnemonicStore.saveToFile}
            >
              Save To File
            </Button>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(SaveMnemonic);
