import React, { Component } from 'react';
import { Typography, Select, MenuItem, TextField, Button, withStyles, WithStyles } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';
import AppStore from '../../stores/AppStore';
import { handleEnterPress } from '../../../utils';

interface IProps {
  classes: Record<string, string>;
  store: AppStore;
}

@inject('store')
@observer
class Send extends Component<WithStyles & IProps, {}> {
  public componentDidMount() {
    this.props.store.sendStore.init();
  }

  public render() {
    const { classes } = this.props;
    const { loggedInAccount, info } = this.props.store.sessionStore;

    if (!loggedInAccount || !info) {
      return null;
    }

    return (
      <div className={classes.root}>
        <NavBar hasBackButton title="Send" />
        <div className={classes.contentContainer}>
          <div className={classes.fieldsContainer}>
            <FromField {...this.props} />
            <ToField onEnterPress={this.onEnterPress} {...this.props} />
            <TokenField {...this.props} />
            <AmountField onEnterPress={this.onEnterPress} {...this.props} />
          </div>
          <SendButton {...this.props} />
        </div>
      </div>
    );
  }

  private onEnterPress = (event: any) => {
    handleEnterPress(event, () => {
      if (!this.props.store.sendStore.buttonDisabled) {
        this.props.store.sendStore.routeToSendConfirm();
      }
    });
  }
}

const Heading = withStyles(styles, { withTheme: true })(({ classes, name }: any) => (
  <Typography className={classes.fieldHeading}>{name}</Typography>
));

const FromField = observer(({ classes, store: { sendStore, sessionStore } }: any) => (
  <div className={classes.fieldContainer}>
    <Heading name="From" />
    <div className={classes.fieldContentContainer}>
      <Select
        className={classes.fromSelect}
        inputProps={{ name: 'from', id: 'from'}}
        disableUnderline
        value={sessionStore.info.addrStr}
        onChange={(event) => sendStore.senderAddress = event.target.value}
      >
        <MenuItem value={sessionStore.info.addrStr}>
          <Typography className={classes.fromAddress}>{sessionStore.loggedInAccount.name}</Typography>
        </MenuItem>
      </Select>
      <Typography className={classes.fromBalance}>{sessionStore.info.balance} QTUM</Typography>
    </div>
  </div>
));

const ToField = observer(({ classes, store: { sendStore, sessionStore }, onEnterPress }: any) => (
  <div className={classes.fieldContainer}>
    <Heading name="To" />
    <div className={classes.fieldContentContainer}>
      <TextField
        fullWidth
        type="text"
        multiline={false}
        placeholder={sessionStore.info.addrStr}
        value={sendStore.receiverAddress}
        InputProps={{ endAdornment: <ArrowDropDown />, disableUnderline: true }}
        onChange={(event) => sendStore.receiverAddress = event.target.value}
        onKeyPress={onEnterPress}
      />
    </div>
    {!!sendStore.receiverAddress && sendStore.receiverFieldError && (
      <Typography className={classes.errorText}>{sendStore.receiverFieldError}</Typography>
    )}
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

const AmountField = observer(({ classes, store: { sendStore, sessionStore }, onEnterPress }: any) => (
  <div className={classes.amountContainer}>
    <div className={classes.amountHeadingContainer}>
      <div className={classes.amountHeadingTextContainer}>
        <Heading name="Amount" />
      </div>
      <Button
        color="primary"
        className={classes.maxButton}
        onClick={() => sendStore.amount = sessionStore.info.balance}
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
        InputProps={{
          endAdornment: <Typography className={classes.amountTokenAdornment}>{sendStore.token}</Typography>,
          disableUnderline: true,
        }}
        onChange={(event) => sendStore.amount = event.target.value}
        onKeyPress={onEnterPress}
      />
    </div>
    {sendStore.amountFieldError && (
      <Typography className={classes.errorText}>{sendStore.amountFieldError}</Typography>
    )}
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

export default withStyles(styles)(Send);
