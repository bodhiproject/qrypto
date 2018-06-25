import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Typography, Card, CardContent, Button } from '@material-ui/core';

@withRouter
@inject('store')
@observer
export default class MainAccount extends Component<any, {}> {

  public handleClick = (id, event) => {
    event.stopPropagation();

    switch (id) {
      case 'mainCard': {
        this.props.history.push('/account-detail');
        break;
      }
      case 'sendButton': {
        this.props.history.push('/send');
        break;
      }
      case 'receiveButton': {
        this.props.history.push('/receive');
        break;
      }
      default: {
        break;
      }
    }
  }

  public componentWillMount() {
    this.props.store.walletStore.startGetInfoPolling();
  }

  public componentWillUnmount() {
    this.props.store.ui.prevLocation = '/';
  }

  public render() {
    const { info } = this.props.store.walletStore;

    return(
      <div>
        <MainAccountCard address={info.addrStr} balance={info.balance} handleClick={this.handleClick} />
      </div>
    );
  }
}

const MainAccountCard = ({ address, balance, handleClick }) => (
  <Card id="mainCard" onClick={(e) => handleClick('mainCard', e)} style={{ cursor: 'pointer' }}>
    <CardContent>
      <Typography variant="title" style={{ marginBottom: 8 }}>Account Name</Typography>
      <Typography variant="caption">{address}</Typography>
      <Typography variant="caption" style={{ marginBottom: 8 }}>{balance} QTUM</Typography>
      <div style={{ textAlign: 'right' }}>
        <Button
          id="sendButton"
          color="primary"
          variant="raised"
          size="small"
          onClick={(e) => handleClick('sendButton', e)}
          style={{ marginRight: 8, minWidth: 0, minHeight: 0, fontSize: 11 }}
         >
           Send
         </Button>
        <Button
          id="receiveButton"
          color="primary"
          variant="raised"
          size="small"
          onClick={(e) => handleClick('receiveButton', e)}
          style={{ minWidth: 0, minHeight: 0, fontSize: 11 }}
         >
           Receive
         </Button>
      </div>
    </CardContent>
  </Card>
);
