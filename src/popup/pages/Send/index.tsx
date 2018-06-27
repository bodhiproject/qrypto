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
        <div style={{ margin: Theme.spacing.sm }}>
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
  <div style={{ marginBottom: Theme.spacing.lg }}>
    <Typography style={{ fontSize: Theme.font.sm, fontWeight: 'bold' }}>From</Typography>
    <div style={{ padding: Theme.spacing.sm, border: Theme.border.root, borderRadius: Theme.border.radius }}>
      <Select
        disableUnderline
        value={walletStore.info.addrStr}
        onChange={(event) => walletStore.fromAddress = event.target.value}
        inputProps={{ name: 'from', id: 'from' }}
        style={{ width: '100%' }}
      >
        <MenuItem value={walletStore.info.addrStr}>
          <Typography style={{ fontSize: Theme.font.md, fontWeight: 'bold' }}>{'Default Account'}</Typography>
        </MenuItem>
      </Select>
      <Typography style={{ fontSize: Theme.font.md, color: '#333333' }}>{walletStore.info.balance} QTUM</Typography>
    </div>
  </div>
);

const ToField = ({ walletStore }) => (
  <div style={{ marginBottom: Theme.spacing.lg }}>
    <Typography style={{ fontSize: Theme.font.sm, fontWeight: 'bold' }}>To</Typography>
    <div style={{ padding: Theme.spacing.sm, border: Theme.border.root, borderRadius: Theme.border.radius }}>
      <TextField
        fullWidth
        type="text"
        multiline={false}
        placeholder={walletStore.info.addrStr}
        InputProps={{ endAdornment: <ArrowDropDown />, disableUnderline: true }}
        onChange={(event) => walletStore.sendToAddress = event.target.value}
      />
    </div>
  </div>
);

const TokenField = ({ walletStore }) => (
  <div style={{ marginBottom: Theme.spacing.lg }}>
    <Typography style={{ fontSize: Theme.font.sm, fontWeight: 'bold' }}>Token</Typography>
    <div style={{ padding: Theme.spacing.sm, border: Theme.border.root, borderRadius: Theme.border.radius }}>
      <Select
        disableUnderline
        value="QTUM"
        inputProps={{ name: 'from', id: 'from' }}
        style={{ width: '100%' }}
        onChange={(event) => walletStore.sendToTokenType = event.target.value}
      >
        <MenuItem value="QTUM">
          <Typography style={{ fontSize: Theme.font.md, fontWeight: 'bold' }}>QTUM</Typography>
        </MenuItem>
      </Select>
    </div>
  </div>
);

const AmountField = ({ walletStore }) => (
  <div style={{ marginBottom: Theme.spacing.custom(26) }}>
    <div style={{ width: '100%', flexDirection: 'row', display: 'inline-flex' }}>
      <Typography style={{ fontSize: Theme.font.sm, fontWeight: 'bold', flex: 1 }}>Amount</Typography>
      <Button color="primary" style={{ minWidth: 0, minHeight: 0, padding: '0 4px' }}>Max</Button>
    </div>
    <div style={{ padding: Theme.spacing.sm, border: Theme.border.root, borderRadius: Theme.border.radius }}>
      <TextField
        fullWidth
        type="number"
        multiline={false}
        placeholder="0.00"
        InputProps={{ 
          endAdornment: (
            <Typography
              style={{
                fontSize: Theme.font.md,
                fontWeight: 'bold',
                marginLeft: Theme.spacing.sm,
                display: 'flex',
                alignItems: 'center'
              }}
             >
              {walletStore.sendToTokenType}
            </Typography>
          ),
          disableUnderline: true,
        }}
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
