import React, { Component } from 'react';
import { Typography, Select, MenuItem, TextField, Button } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { NavBar } from '../../components/NavBar';
import Theme from '../../../config/theme';

@inject('store')
@observer
export default class Send extends Component<any, {}> {
  public componentDidMount() {
    this.props.store.ui.prevLocation = '/account-detail';
  }

  public render() {
    const { walletStore } = this.props.store;

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <NavBar hasBackButton={true} title="Send" />
        <div style={{ margin: Theme.spacing.xs }}>
          <div style={{ flex: 1 }}>
            <FromField walletStore={walletStore} />
            <ToField walletStore={walletStore} />
            <TokenField walletStore={walletStore} />
            <AmountField walletStore={walletStore} />
          </div>
          <SendButton />
        </div>
      </div>
    );
  }
}

const FromField = ({ walletStore }) => (
  <div style={{ marginBottom: Theme.spacing.md }}>
    <Typography variant="subheading" style={{ fontWeight: 'bold' }}>From</Typography>
    <div style={{ padding: 12, border: '1px solid #cccccc', borderRadius: 4 }}>
      <Select
        disableUnderline
        value={walletStore.info.addrStr}
        onChange={(event) => walletStore.fromAddress = event.target.value}
        inputProps={{ name: 'from', id: 'from' }}
        style={{ width: '100%' }}
      >
        <MenuItem value={walletStore.info.addrStr}>
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>{'Default Account'}</Typography>
        </MenuItem>
      </Select>
      <Typography style={{ fontSize: 14, color: '#333333' }}>{walletStore.info.balance} QTUM</Typography>
    </div>
  </div>
);

const ToField = ({ walletStore }) => (
  <div style={{ marginBottom: Theme.spacing.md }}>
    <Typography variant="subheading" style={{ fontWeight: 'bold' }}>To</Typography>
    <div style={{ padding: 12, border: '1px solid #cccccc', borderRadius: 4 }}>
      <TextField
        fullWidth
        type="text"
        multiline={false}
        InputProps={{ endAdornment: <ArrowDropDown /> }}
        onChange={(event) => walletStore.sendToAddress = event.target.value}
      />
    </div>
  </div>
);

const TokenField = ({ walletStore }) => (
  <div style={{ marginBottom: Theme.spacing.md }}>
    <Typography variant="subheading" style={{ fontWeight: 'bold' }}>Token</Typography>
    <div style={{ padding: 12, border: '1px solid #cccccc', borderRadius: 4 }}>
      <Select
        disableUnderline
        value="QTUM"
        inputProps={{ name: 'from', id: 'from' }}
        style={{ width: '100%' }}
        onChange={(event) => walletStore.sendToTokenType = event.target.value}
      >
        <MenuItem value="QTUM">
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>QTUM</Typography>
        </MenuItem>
      </Select>
    </div>
  </div>
);

const AmountField = ({ walletStore }) => (
  <div style={{ marginBottom: Theme.spacing.custom(12) }}>
    <div style={{ width: '100%', flexDirection: 'row', display: 'inline-flex' }}>
      <Typography variant="subheading" style={{ fontWeight: 'bold', flex: 1 }}>Amount</Typography>
      <Button color="primary" style={{ minWidth: 0, minHeight: 0, padding: '0 4px' }}>Max</Button>
    </div>
    <div style={{ padding: 12, border: '1px solid #cccccc', borderRadius: 4 }}>
      <TextField
        fullWidth
        type="number"
        multiline={false}
        InputProps={{ endAdornment: (
          <Typography style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 8, display: 'flex', alignItems: 'center' }}>
            {walletStore.sendToTokenType}
          </Typography>
        )}}
        onChange={(event) => walletStore.sendToAmount = event.target.value}
      />
    </div>
  </div>
);

const SendButton = withRouter(({ history }) => (
  <Button fullWidth variant="contained" color="primary" onClick={() => history.push('/send-confirm')}>
    Send
  </Button>
));
