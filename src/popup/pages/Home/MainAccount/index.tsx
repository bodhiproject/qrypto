import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Typography, Card, CardContent } from '@material-ui/core';

@withRouter
@inject('store')
@observer
export default class MainAccount extends Component<any, {}> {

  handleClick = () => {
    this.props.history.push('/account-detail')
  }

  componentWillUnmount() {
    this.props.store.ui.prevLocation = '/'
  }
  
  public render(){
    const { info } = this.props.store.walletStore
    console.log("info:", info)

    return(
      <div style={{ margin: 16 }}>
        <h3>Main Account Page</h3>
        <MainAccountCard address={info.addrStr} balance={info.balance} onClick={this.handleClick} />
      </div>
    )
  }
}

const MainAccountCard = ({ address, balance, onClick }) => (
  <Card onClick={onClick} style={{ cursor: 'pointer' }}>
    <CardContent style={{ margin: 8 }}>
      <Typography variant="title" style={{ marginBottom: 8 }}>Account Name</Typography>
      <Typography variant="caption">{address}</Typography>
      <Typography variant="caption">{balance} QTUM</Typography>
    </CardContent>
  </Card>
);
