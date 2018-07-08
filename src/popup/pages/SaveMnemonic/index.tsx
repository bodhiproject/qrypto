import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Typography, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';

import styles from './styles';
import NavBar from '../../components/NavBar';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class SaveMnemonic extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public componentDidMount() {
    this.props.store.saveMnemonicStore.generateMnemonic();
  }

  public render() {
    const { classes, history, store: { saveMnemonicStore: { mnemonic } } } = this.props;

    return (
      <div className={classes.root}>
        <NavBar hasBackButton title="Wallet Created" />
        <div className={classes.contentContainer}>
          <Typography className={classes.warningText}>These words in this specific order are the only way to restore your wallet. Save them somewhere safe and don't share them with anyone!</Typography>
          <Typography className={classes.mnemonicText}>{mnemonic}</Typography>
          <Button
              className={cx(classes.actionButton, 'marginBottom')}
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => history.push('/home')}
            >
              I Have Copied It Somewhere Safe
            </Button>
            <Button
              className={classes.actionButton}
              fullWidth
              variant="contained"
              color="secondary"
              onClick={this.onSaveAsFileClick}
              disabled={importStore.error}
            >
              Save Mnemonic As File
            </Button>
        </div>
      </div>
    );
  }

  private onSaveAsFileClick = () => {
    // TODO: implement save as txt file
  }
}
