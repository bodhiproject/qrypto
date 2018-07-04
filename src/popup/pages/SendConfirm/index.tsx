import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Typography, withStyles, Button } from '@material-ui/core';

import styles from './styles';
import NavBar from '../../components/NavBar';
import cx from 'classnames';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class Send extends Component<any, {}> {

  public handleConfirm = () => {
    this.props.store.walletStore.send();
    // TODO? UI decision - do we want to stay on the page after the transaction has been confirmed?
    // this.props.history.push('/account-detail')
  }

  public render() {
    const { walletStore } = this.props.store;
    const { info, receiverAddress, amount, tip } = walletStore;
    const { classes } = this.props;

    return(
      <div className={classes.sendConfirmRoot}>
        <NavBar hasBackButton={true} title={'Send Confirm'} />
        <div className={classes.contentContainer}>
          <div className={classes.inputContainer}>
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>From</Typography>
              <Typography className={classes.fieldValue}>{info.addrStr}</Typography>
            </div>
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>To</Typography>
              <Typography className={classes.fieldValue}>{receiverAddress}</Typography>
            </div>
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>Amount</Typography>
              <Typography className={classes.fieldValue}>{amount} <span className={classes.fieldUnit}>QTUM</span></Typography>
            </div>
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>Gas Limit</Typography>
              <Typography className={classes.fieldValue}>{`Gas Limit`} <span className={classes.fieldUnit}>GAS</span></Typography>
            </div>
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>Gas Price</Typography>
              <Typography className={classes.fieldValue}>{`Gas Price`} <span className={classes.fieldUnit}>QTUM</span></Typography>
            </div>
            <div className={cx(classes.fieldContainer, 'last')}>
              <Typography className={classes.fieldLabel}>Max Transaction Fee</Typography>
              <Typography className={classes.fieldValue}>{`<0.000489>`} <span className={classes.fieldUnit}>QTUM</span></Typography>
            </div>
          </div>
          <Button fullWidth variant="contained" color="primary" onClick={this.handleConfirm}>
            CONFIRM
          </Button>
          {tip}
        </div>
      </div>
    );
  }
}
