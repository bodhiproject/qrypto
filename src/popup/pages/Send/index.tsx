import React, { Component } from 'react';
import { Typography, Select, MenuItem, TextField, Button, withStyles, WithStyles } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';
import { map } from 'lodash';

import styles from './styles';
import NavBar from '../../components/NavBar';
import AppStore from '../../stores/AppStore';
import { handleEnterPress } from '../../../utils';
import QRCToken from '../../../models/QRCToken';

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
    const { loggedInAccountName } = this.props.store.sessionStore;

    if (!loggedInAccountName) {
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
            {this.props.store.sendStore.token && this.props.store.sendStore.token.symbol === 'QTUM' ? (
                <TransactionSpeedField {...this.props} />
            ) : (
              <div>
                <GasLimitField onEnterPress={this.onEnterPress} {...this.props} />
                <GasPriceField onEnterPress={this.onEnterPress} {...this.props} />
              </div>
            )}
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
        className={classes.selectOrTextField}
        inputProps={{ name: 'from', id: 'from'}}
        disableUnderline
        value={sessionStore.info.addrStr}
        onChange={(event) => sendStore.senderAddress = event.target.value}
      >
        <MenuItem value={sessionStore.info.addrStr}>
          <Typography className={classes.fieldTextOrInput}>{sessionStore.loggedInAccountName}</Typography>
        </MenuItem>
      </Select>
    </div>
  </div>
));

const ToField = observer(({ classes, store: { sendStore, sessionStore }, onEnterPress }: any) => (
  <div className={classes.fieldContainer}>
    <Heading name="To" />
    <div className={classes.fieldContentContainer}>
      <TextField
        className={classes.selectOrTextField}
        fullWidth
        type="text"
        multiline={false}
        placeholder={sessionStore.info.addrStr}
        value={sendStore.receiverAddress || ''}
        InputProps={{ className: classes.fieldTextOrInput, endAdornment: <ArrowDropDown />, disableUnderline: true }}
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
        className={classes.selectOrTextField}
        disableUnderline
        value={sendStore.token ? sendStore.token.symbol : ''}
        onChange={(event) => sendStore.changeToken(event.target.value)}
      >
        {map(sendStore.tokens, (token: QRCToken) => (
          <MenuItem key={token.symbol} value={token.symbol}>
            <Typography className={classes.fieldTextOrInput}>{token.symbol}</Typography>
          </MenuItem>
        ))}
      </Select>
    </div>
  </div>
));

const AmountField = observer(({ classes, store: { sendStore }, onEnterPress }: any) => (
  <div className={classes.fieldContainer}>
    <div className={classes.buttonFieldHeadingContainer}>
      <div className={classes.buttonFieldHeadingTextContainer}>
        <Heading name="Amount" />
      </div>
      <Typography className={classes.fieldButtonText}>{sendStore.maxAmount}</Typography>
      <Button
        color="primary"
        className={classes.fieldButton}
        onClick={() => sendStore.amount = sendStore.maxAmount}
      >
        Max
      </Button>
    </div>
    <div className={classes.fieldContentContainer}>
      <TextField
        className={classes.selectOrTextField}
        fullWidth
        type="number"
        multiline={false}
        placeholder={'0.00'}
        value={sendStore.amount}
        InputProps={{
          classes: {
            input: classes.fieldInput,
          },
          className: classes.fieldTextOrInput,
          endAdornment: (
            <Typography className={classes.fieldTextAdornment}>
              {sendStore.token && sendStore.token.symbol}
            </Typography>
          ),
          disableUnderline: true,
        }}
        onChange={(event) => sendStore.amount = event.target.value}
        onKeyPress={onEnterPress}
      />
    </div>
    {sendStore.amount && sendStore.amountFieldError && (
      <Typography className={classes.errorText}>{sendStore.amountFieldError}</Typography>
    )}
  </div>
));

const TransactionSpeedField = observer(({ classes, store: { sendStore } }: any) => (
  <div className={classes.fieldContainer}>
    <Heading name="Transaction Speed" />
    <div className={classes.fieldContentContainer}>
      <Select
        className={classes.selectOrTextField}
        disableUnderline
        value={sendStore.transactionSpeed}
        onChange={(event) => sendStore.transactionSpeed = (event.target.value)}
      >
        {map(sendStore.transactionSpeeds, (transactionSpeed: string) => (
          <MenuItem key={transactionSpeed} value={transactionSpeed}>
            <Typography className={classes.fieldTextOrInput}>{transactionSpeed}</Typography>
          </MenuItem>
        ))}
      </Select>
    </div>
  </div>
));

const GasLimitField = observer(({ classes, store: { sendStore }, onEnterPress }: any) => (
  <div className={classes.fieldContainer}>
    <div className={classes.buttonFieldHeadingContainer}>
      <div className={classes.buttonFieldHeadingTextContainer}>
        <Heading name="Gas Limit" />
      </div>
      <Typography className={classes.fieldButtonText}>{sendStore.gasLimitRecommendedAmount}</Typography>
      <Button
        color="primary"
        className={classes.fieldButton}
        onClick={() => sendStore.gasLimit = sendStore.gasLimitRecommendedAmount}
      >
        Recommended
      </Button>
    </div>
    <div className={classes.fieldContentContainer}>
      <TextField
        className={classes.selectOrTextField}
        fullWidth
        type="number"
        multiline={false}
        placeholder={'sendStore.gasLimitRecommendedAmount'}
        value={sendStore.gasLimit}
        InputProps={{
          classes: {
            input: classes.fieldInput,
          },
          className: classes.fieldTextOrInput,
          endAdornment: (
            <Typography className={classes.fieldTextAdornment}>
              GAS
            </Typography>
          ),
          disableUnderline: true,
        }}
        onChange={(event) => sendStore.gasLimit = event.target.value}
        onKeyPress={onEnterPress}
      />
    </div>
    {sendStore.gasLimitFieldError && (
      <Typography className={classes.errorText}>{sendStore.gasLimitFieldError}</Typography>
    )}
  </div>
));

const GasPriceField = observer(({ classes, store: { sendStore }, onEnterPress }: any) => (
  <div className={classes.fieldContainer}>
    <div className={classes.buttonFieldHeadingContainer}>
      <div className={classes.buttonFieldHeadingTextContainer}>
        <Heading name="Gas Price" />
      </div>
      <Typography className={classes.fieldButtonText}>{sendStore.gasPriceRecommendedAmount}</Typography>
      <Button
        color="primary"
        className={classes.fieldButton}
        onClick={() => sendStore.gasPrice = sendStore.gasPriceRecommendedAmount}
      >
        Recommended
      </Button>
    </div>
    <div className={classes.fieldContentContainer}>
      <TextField
        className={classes.selectOrTextField}
        fullWidth
        type="number"
        multiline={false}
        placeholder={'sendStore.gasPriceRecommendedAmount'}
        value={sendStore.gasPrice.toString()}
        InputProps={{
          classes: {
            input: classes.fieldInput,
          },
          className: classes.fieldTextOrInput,
          endAdornment: (
            <Typography className={classes.fieldTextAdornment}>
              SATOSHI/GAS
            </Typography>
          ),
          disableUnderline: true,
        }}
        onChange={(event) => sendStore.gasPrice = event.target.value}
        onKeyPress={onEnterPress}
      />
    </div>
    {sendStore.gasPriceFieldError && (
      <Typography className={classes.errorText}>{sendStore.gasPriceFieldError}</Typography>
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
