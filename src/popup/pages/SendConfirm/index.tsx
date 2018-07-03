import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';

import styles from './styles';
import NavBar from '../../components/NavBar';

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
      <div>
        <NavBar hasBackButton={true} title={'Send Confirm'} />
        <div className={classes.contentContainer}>
          <div className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>From</div>
            <div className={classes.fieldValue}>{info.addrStr}</div>
          </div>
          <div className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>To</div>
            <div className={classes.fieldValue}>{receiverAddress}</div>
          </div>
          <div className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Amount</div>
            <div className={classes.fieldValue}>{amount} <span className={classes.fieldUnit}>QTUM</span></div>
          </div>
          <div className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Gas Limit</div>
            <div className={classes.fieldValue}>{`<GAS LIMIT>`} <span className={classes.fieldUnit}>UNITS</span></div>
          </div>
          <div className={classes.fieldContainer}>
            <div className={classes.fieldLabel}>Gas Price</div>
            <div className={classes.fieldValue}>{`<GAS PRICE>`} <span className={classes.fieldUnit}>GWEI</span></div>
          </div>
          <div className={classes.fieldContainer + ' ' + classes.fieldContainerLast}>
            <div className={classes.fieldLabel}>Max Transaction Fee</div>
            <div className={classes.fieldValue}>{`<0.000489>`} <span className={classes.fieldUnit}>QTUM</span></div>
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
