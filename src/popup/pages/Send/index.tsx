import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, Select, MenuItem, TextField, Button, withStyles } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class Send extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public componentDidMount() {
    const { store: { sendStore, walletStore } } = this.props;

    // Set default sender address
    sendStore.senderAddress = walletStore.info.addrStr;
  }

  public render() {
    const { classes, store: { sendStore, walletStore } } = this.props;
    const { token, amount } = sendStore;
    const { info } = walletStore;

    return (
      <div className={classes.root}>
        <NavBar hasBackButton={true} title="Send" />
        <div className={classes.contentContainer}>
          <FromField info={info} sendStore={sendStore} />
          <ToField info={info} sendStore={sendStore} />
          <TokenField token={token} sendStore={sendStore} />
          <AmountField info={info} amount={amount} token={token} sendStore={sendStore} />
          <SendButton {...this.props} />
        </div>
      </div>
    );
  }
}

const Heading = withStyles(styles, { withTheme: true })(({ classes, name }) => (
  <Typography className={classes.fieldHeading}>{name}</Typography>
));

const FromField = withStyles(styles, { withTheme: true })(({ classes, info, sendStore }) => (
  <div className={classes.fieldContainer}>
    <Heading name="From" />
    <div className={classes.fieldContentContainer}>
      <Select
        disableUnderline
        value={info.addrStr}
        onChange={(event) => sendStore.senderAddress = event.target.value}
        inputProps={{ name: 'from', id: 'from' }}
        className={classes.fromSelect}
      >
        <MenuItem value={info.addrStr}>
          <Typography className={classes.fromAddress}>{'Default Account'}</Typography>
        </MenuItem>
      </Select>
      <Typography className={classes.fromBalance}>{info.balance} QTUM</Typography>
    </div>
  </div>
));

const ToField = withStyles(styles, { withTheme: true })(({ classes, info, sendStore }) => (
  <div className={classes.fieldContainer}>
    <Heading name="To" />
    <div className={classes.fieldContentContainer}>
      <TextField
        fullWidth
        type="text"
        multiline={false}
        placeholder={info.addrStr}
        InputProps={{ endAdornment: <ArrowDropDown />, disableUnderline: true }}
        onChange={(event) => sendStore.receiverAddress = event.target.value}
      />
    </div>
  </div>
));

const TokenField = withStyles(styles, { withTheme: true })(({ classes, token, sendStore }) => (
  <div className={classes.fieldContainer}>
    <Heading name="Token" />
    <div className={classes.fieldContentContainer}>
      <Select
        disableUnderline
        value={token}
        inputProps={{ name: 'from', id: 'from' }}
        className={classes.tokenSelect}
        onChange={(event) => sendStore.token = event.target.value}
      >
        <MenuItem value="QTUM">
          <Typography className={classes.tokenText}>QTUM</Typography>
        </MenuItem>
      </Select>
    </div>
  </div>
));

const AmountField = withStyles(styles, { withTheme: true })(({ classes, info, amount, token, sendStore }) => (
  <div className={classes.amountContainer}>
    <div className={classes.amountHeadingContainer}>
      <div className={classes.amountHeadingTextContainer}>
        <Heading name="Amount" />
      </div>
      <Button
        color="primary"
        className={classes.maxButton}
        onClick={() => sendStore.amount = info.balance}
      >
        Max
      </Button>
    </div>
    <div className={classes.fieldContentContainer}>
      <TextField
        fullWidth
        type="number"
        multiline={false}
        placeholder="0.00"
        value={amount}
        InputProps={{
          endAdornment: <Typography className={classes.amountTokenAdornment}>{token}</Typography>,
          disableUnderline: true,
        }}
        onChange={(event) => sendStore.amount = event.target.value}
      />
    </div>
  </div>
));

const SendButton = ({ classes, history }: any) => (
  <Button
    className={classes.sendButton}
    fullWidth
    variant="contained"
    color="primary"
    onClick={() => history.push('/send-confirm')}
  >
    Send
  </Button>
);
