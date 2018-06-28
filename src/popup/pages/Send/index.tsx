import React, { Component } from 'react';
import { Typography, Select, MenuItem, TextField, Button } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { NavBar } from '../../components/NavBar';
import Theme from '../../../config/theme';

@inject('store')
@observer
export default class Send extends Component {
  public componentDidMount() {
    const { store } = this.props;

    store.ui.prevLocation = '/account-detail';

    // Set default sender address
    store.walletStore.senderAddress = store.walletStore.info.addrStr;
  }

  public render() {
    const { walletStore } = this.props.store;
    const { info, token, amount } = walletStore;

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <NavBar hasBackButton={true} title="Send" />
        <div style={{ margin: Theme.spacing.sm }}>
          <div style={{ flex: 1 }}>
            <FromField info={info} walletStore={walletStore} />
            <ToField info={info} walletStore={walletStore} />
            <TokenField token={token} walletStore={walletStore} />
            <AmountField amount={amount} token={token} walletStore={walletStore} />
          </div>
          <SendButton />
        </div>
      </div>
    );
  }
}

const Heading = ({ name }) => (
  <Typography
    style={{ marginBottom: Theme.spacing.unit, fontSize: Theme.font.sm, fontWeight: 'bold' }}
  >
    {name}
  </Typography>
);

const FromField = ({ info, walletStore }) => (
  <div style={{ marginBottom: Theme.spacing.lg }}>
    <Heading name="From" />
    <div style={{ padding: Theme.spacing.sm, border: Theme.border.root, borderRadius: Theme.border.radius }}>
      <Select
        disableUnderline
        value={info.addrStr}
        onChange={(event) => walletStore.senderAddress = event.target.value}
        inputProps={{ name: 'from', id: 'from' }}
        style={{ width: '100%' }}
      >
        <MenuItem value={info.addrStr}>
          <Typography style={{ fontSize: Theme.font.md, fontWeight: 'bold' }}>{'Default Account'}</Typography>
        </MenuItem>
      </Select>
      <Typography style={{ fontSize: Theme.font.md, color: '#333333' }}>{info.balance} QTUM</Typography>
    </div>
  </div>
);

const ToField = ({ info, walletStore }) => (
  <div style={{ marginBottom: Theme.spacing.lg }}>
    <Heading name="To" />
    <div style={{ padding: Theme.spacing.sm, border: Theme.border.root, borderRadius: Theme.border.radius }}>
      <TextField
        fullWidth
        type="text"
        multiline={false}
        placeholder={info.addrStr}
        InputProps={{ endAdornment: <ArrowDropDown />, disableUnderline: true }}
        onChange={(event) => walletStore.receiverAddress = event.target.value}
      />
    </div>
  </div>
);

const TokenField = ({ token, walletStore }) => (
  <div style={{ marginBottom: Theme.spacing.lg }}>
    <Heading name="Token" />
    <div style={{ padding: Theme.spacing.sm, border: Theme.border.root, borderRadius: Theme.border.radius }}>
      <Select
        disableUnderline
        value={token}
        inputProps={{ name: 'from', id: 'from' }}
        style={{ width: '100%' }}
        onChange={(event) => walletStore.token = event.target.value}
      >
        <MenuItem value="QTUM">
          <Typography style={{ fontSize: Theme.font.md, fontWeight: 'bold' }}>QTUM</Typography>
        </MenuItem>
      </Select>
    </div>
  </div>
);

const AmountField = ({ amount, token, walletStore }) => (
  <div style={{ marginBottom: Theme.spacing.custom(26) }}>
    <div style={{ width: '100%', flexDirection: 'row', display: 'inline-flex' }}>
      <div style={{ flex: 1 }}>
        <Heading name="Amount" />
      </div>
      <Button
        color="primary"
        style={{ minWidth: 0, minHeight: 0, padding: '0 4px' }}
        onClick={() => walletStore.amount = walletStore.info.balance}
      >
        Max
      </Button>
    </div>
    <div style={{ padding: Theme.spacing.sm, border: Theme.border.root, borderRadius: Theme.border.radius }}>
      <TextField
        fullWidth
        type="number"
        multiline={false}
        placeholder="0.00"
        value={amount}
        InputProps={{
          endAdornment: (
            <Typography
              style={{
                fontSize: Theme.font.md,
                fontWeight: 'bold',
                marginLeft: Theme.spacing.sm,
                display: 'flex',
                alignItems: 'center',
              }}
             >
              {token}
            </Typography>
          ),
          disableUnderline: true,
        }}
        onChange={(event) => walletStore.amount = event.target.value}
      />
    </div>
  </div>
);

const SendButton = withRouter(({ history }) => (
  <Button fullWidth variant="contained" color="primary" onClick={() => history.push('/send-confirm')}>
    Send
  </Button>
));
