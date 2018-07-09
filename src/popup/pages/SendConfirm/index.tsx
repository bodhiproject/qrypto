import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { when } from 'mobx';
import { Typography, withStyles, Button } from '@material-ui/core';
import { SEND_STATE } from '../../../stores/SendStore';

import styles from './styles';
import NavBar from '../../components/NavBar';
import cx from 'classnames';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class SendConfirm extends Component<any, {}> {

  public handleConfirm = () => {
    const { history, store: { sendStore } } = this.props;
    sendStore.send();
    when(
      () => sendStore.sendState === 'Sent!',
      () => {
        sendStore.sendState = 'Initial';
        history.push('/home');
        history.push('/account-detail');
      },
    );
  }

  public render() {
    const { classes, store: { sendStore } } = this.props;
    const { senderAddress, receiverAddress, amount, token, sendState, errorMessage } = sendStore;
    const { SENDING, SENT } = SEND_STATE;

    return(
      <div className={classes.sendConfirmRoot}>
        <NavBar hasBackButton={true} title="Confirm" />
        <div className={classes.contentContainer}>
          <div className={classes.inputContainer}>
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>From</Typography>
              <Typography className={classes.fieldValue}>{senderAddress}</Typography>
            </div>
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>To</Typography>
              <Typography className={classes.fieldValue}>{receiverAddress}</Typography>
            </div>
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>Amount</Typography>
              <Typography className={classes.fieldValue}>{amount} <span className={classes.fieldUnit}>{token}</span></Typography>
            </div>
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>Gas Limit</Typography>
              <Typography className={classes.fieldValue}>250000 <span className={classes.fieldUnit}>GAS</span></Typography>
            </div>
            <div className={classes.fieldContainer}>
              <Typography className={classes.fieldLabel}>Gas Price</Typography>
              <Typography className={classes.fieldValue}>0.0000004 <span className={classes.fieldUnit}>QTUM</span></Typography>
            </div>
            <div className={cx(classes.fieldContainer, 'last')}>
              <Typography className={classes.fieldLabel}>Max Transaction Fee</Typography>
              <Typography className={classes.fieldValue}>0.01 <span className={classes.fieldUnit}>QTUM</span></Typography>
            </div>
          </div>
          { errorMessage }
            <Button fullWidth disabled={[SENDING, SENT].includes(sendState)} variant="contained" color="primary" onClick={this.handleConfirm}>
            { sendState }
            </Button>
        </div>
      </div>
    );
  }
}
