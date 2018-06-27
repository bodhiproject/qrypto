import React, { Component } from 'react';
import { Typography, Select, MenuItem, TextField, Button } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { NavBar } from '../../components/NavBar';

@withRouter
@inject('store')
@observer
export default class Send extends Component<any, {}> {
  state = {
    from: '',
  }

  private onFromChange = () => {
    // TODO: implement
  }

  public handleCreate = () => {
    this.props.history.push('/send-confirm');
  }

  public componentDidMount() {
    this.props.store.ui.prevLocation = '/account-detail';
  }

  public render() {
    const { walletStore } = this.props.store;
    const { info } = walletStore;

    return (
      <div>
        <NavBar hasBackButton={true} title='Send' />
        <div style={{ margin: 8 }}>
          <FromField info={info} onFromChange={this.onFromChange} />
          {<ToField />}

          {/*
          <div>
            <h6>{`<Account Name>`}</h6>
            <p>{info.addrStr}</p>
            <p>{info.balance} QTUM</p>
            <p>= {`<123... USD>`}</p>
          </div>
          <h4>Send to Address</h4>
          <input value={walletStore.sendToAddress} onChange={(e) => walletStore.sendToAddress = e.target.value} />
          <h4>Toke type</h4>
          <input value={walletStore.sendToTokenType} onChange={(e) => walletStore.sendToTokenType = e.target.value} />
          <h4>Value</h4>
          <input value={walletStore.sendToAmount} onChange={(e) => walletStore.sendToAmount = e.target.value} />
          <Button variant="contained" color="primary" onClick={this.handleCreate}>
            Create
          </Button>
          */}
        </div>
      </div>
    );
  }
}

const FromField = ({ info, onFromChange }) => (
  <div style={{ marginBottom: 16 }}>
    <Typography variant='subheading' style={{ fontWeight: 'bold' }}>From</Typography>
    <div style={{ padding: 12, border: '1px solid #cccccc', borderRadius: 4 }}>
      <Select
        disableUnderline
        value={info.addrStr}
        onChange={onFromChange}
        inputProps={{ name: 'from', id: 'from' }}
        style={{ width: '100%' }}
      >
        <MenuItem value={info.addrStr}>
          <Typography style={{ fontSize: 16, fontWeight: 'bold' }}>{'Default Account'}</Typography>
        </MenuItem>
      </Select>
      <Typography style={{ fontSize: 14, color: '#333333' }}>{info.balance} QTUM</Typography>
    </div>
  </div>
);

const ToField = ({ info, onFromChange }) => (
  <div>
    <Typography variant='subheading' style={{ fontWeight: 'bold' }}>To</Typography>
    <div style={{ padding: 12, border: '1px solid #cccccc', borderRadius: 4 }}>
      <TextField
        fullWidth
        type='text'
        multiline={false}
        InputProps={{
          endAdornment: <ArrowDropDown />
        }}
      />
    </div>
  </div>
);
