import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Typography, withStyles } from '@material-ui/core';
import QRCode from 'qrcode.react';

import styles from './styles';
import NavBar from '../../components/NavBar';

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class Receive extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public render() {
    const { classes } = this.props;
    const { info } = this.props.store.walletStore;

    return(
      <div>
        <NavBar hasBackButton={true} title="Receive" />
        <div className={classes.contentContainer}>
          <Typography className={classes.accountName}>{'Default Account'}</Typography>
          <Typography className={classes.accountAddress}>{info.addrStr}</Typography>
          <div className={classes.amountContainer}>
            <Typography className={classes.tokenAmount}>{info.balance}</Typography>
            <Typography className={classes.token}>QTUM</Typography>
          </div>
          <Typography className={classes.currencyValue}>$12345.67</Typography>
          <div className={classes.qrCodeContainer}>
            <QRCode value={info.addrStr} />
          </div>
        </div>
      </div>
    );
  }
}
