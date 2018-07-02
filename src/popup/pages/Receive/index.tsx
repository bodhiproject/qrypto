import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import QRCode from 'qrcode.react';

import NavBar from '../../components/NavBar';

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class Receive extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public componentDidMount() {
    this.props.store.ui.prevLocation = '/account-detail';
  }

  public render() {
    const { classes } = this.props;
    const { info } = this.props.store.walletStore;

    return(
      <div>
        <NavBar hasBackButton={true} title="Receive" />
        <div className={classes.contentContainer}>
          <h6>{`<Account Name>`}</h6>
          <p>{info.addrStr}</p>
          <p>{info.balance} QTUM</p>
          <p>= {`<123... USD>`}</p>
          <p>{`<QR CODE>`}</p>
          <QRCode value={info.addrStr} />
        </div>
      </div>
    );
  }
}
