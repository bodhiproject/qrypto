import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, Select, MenuItem, TextField, Button, withStyles } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';

@withStyles(styles, { withTheme: true })
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
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <NavBar hasBackButton title="Send" />
        <div className={classes.contentContainer}>
          <FromField {...this.props} />
          <ToField {...this.props} />
          <TokenField {...this.props} />
          <AmountField {...this.props} />
          <SendButton {...this.props} />
        </div>
      </div>
    );
  }
}

const Heading = withStyles(styles, { withTheme: true })(({ classes, name }: any) => (
  <Typography className={classes.fieldHeading}>{name}</Typography>
));

const FromField = observer(({ classes, store: { sendStore, walletStore: { loggedInAccount, info } } }: any) => (
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
          <Typography className={classes.fromAddress}>{loggedInAccount.name}</Typography>
        </MenuItem>
      </Select>
      <Typography className={classes.fromBalance}>{info.balance} QTUM</Typography>
    </div>
  </div>
));

const ToField = observer(({ classes, store: { sendStore, walletStore: { info } } }: any) => (
  <div className={classes.fieldContainer}>
    <Heading name="To" />
    <div className={classes.fieldContentContainer}>
      <TextField
        fullWidth
        type="text"
        multiline={false}
        placeholder={info.addrStr}
        helperText={sendStore.receiverFieldError}
        error={sendStore.receiverFieldError}
        InputProps={{ endAdornment: <ArrowDropDown />, disableUnderline: true }}
        onChange={(event) => sendStore.receiverAddress = event.target.value}
      />
    </div>
  </div>
));

const TokenField = observer(({ classes, store: { sendStore } }: any) => (
  <div className={classes.fieldContainer}>
    <Heading name="Token" />
    <div className={classes.fieldContentContainer}>
      <Select
        disableUnderline
        value={sendStore.token}
        inputProps={{ name: 'from', id: 'from' }}
        className={classes.tokenSelect}
        onChange={(event) => sendStore.token = event.target.value}
      >
        <MenuItem value="QTUM"><Typography className={classes.tokenText}>QTUM</Typography></MenuItem>
      </Select>
    </div>
  </div>
));

const AmountField = observer(({ classes, store: { walletStore: { info }, sendStore } }: any) => (
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
        placeholder={'0.00'}
        value={sendStore.amount}
        helperText={sendStore.amountFieldError}
        error={sendStore.amountFieldError}
        InputProps={{
          endAdornment: <Typography className={classes.amountTokenAdornment}>{sendStore.token}</Typography>,
          disableUnderline: true,
        }}
        onChange={(event) => sendStore.amount = event.target.value}
      />
    </div>
  </div>
));

const SendButton = observer(({ classes, store: { sendStore } }: any) => (
  <Button
    className={classes.sendButton}
    fullWidth
    variant="contained"
    color="primary"
    disabled={sendStore.buttonDisabled}
    onClick={sendStore.routeToSendConfirm}
  >
    Send
  </Button>
));
