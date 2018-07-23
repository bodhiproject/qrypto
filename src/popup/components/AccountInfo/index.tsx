import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Typography, Button, withStyles, WithStyles } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { Insight } from 'qtumjs-wallet';

import styles from './styles';
import AppStore from '../../../stores/AppStore';
import { MESSAGE_TYPE } from '../../../constants';

interface IProps {
  classes: Record<string, string>;
  store?: AppStore;
  hasRightArrow?: boolean;
}

interface IState {
  loggedInAccount?: Account;
  info?: Insight.IGetInfo;
  qtumBalanceUSD?: string;
}

@inject('store')
@observer
class AccountInfo extends Component<WithStyles & IProps, IState> {
  public state: IState = {
    loggedInAccount: undefined,
    info: undefined,
    qtumBalanceUSD: undefined,
  };

  public componentDidMount() {
    console.log('didmount');
    chrome.runtime.onMessage.addListener(this.handleMessage);
  }

  public handleClick = (id: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    const location = {
      mainCard: '/account-detail',
      sendButton: '/send',
      receiveButton: '/receive',
    }[id];
    this.props.store!.routerStore.push(location);
  }

  public render() {
    console.log('render');
    const { classes, hasRightArrow } = this.props;
    const { loggedInAccount, info, qtumBalanceUSD } = this.state;

    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_LOGGED_IN_ACCOUNT }, (response: any) => {
      console.log(response);
      this.setState({ loggedInAccount: response });
    });
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_WALLET_INFO }, (response: any) => {
      console.log(response);
      this.setState({ info: response });
    });
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.GET_QTUM_BALANCE_USD }, (response: any) => {
      console.log(response);
      this.setState({ qtumBalanceUSD: response });
    });

    return info && (
      <div className={classes.root}>
        <Typography className={classes.acctName}>{loggedInAccount!.name}</Typography>
        <Typography className={classes.address}>{info.addrStr}</Typography>
        <div className={classes.amountContainer}>
          <Typography className={classes.tokenAmount}>{info.balance}</Typography>
          <Typography className={classes.token}>QTUM</Typography>
          {hasRightArrow && <KeyboardArrowRight className={classes.rightArrow} />}
        </div>
        <Typography className={classes.balanceUSD}>${qtumBalanceUSD} USD</Typography>
        <div className={classes.actionButtonsContainer}>
          <Button
            id="sendButton"
            color="secondary"
            variant="contained"
            size="small"
            className={classes.actionButton}
            onClick={(e) => this.handleClick('sendButton', e)}
            >
              Send
            </Button>
          <Button
            id="receiveButton"
            color="secondary"
            variant="contained"
            size="small"
            className={classes.actionButton}
            onClick={(e) => this.handleClick('receiveButton', e)}
            >
              Receive
            </Button>
        </div>
      </div>
    );
  }

  private handleMessage = (request: any) => {
    switch (request.type) {
      case MESSAGE_TYPE.GET_WALLET_INFO_RETURN:
        // this.setState({ info: request.info });
        break;

      case MESSAGE_TYPE.GET_QTUM_PRICE_RETURN:
        // this.setState({ qtumBalanceUSD: request.qtumBalanceUSD });
        break;

      default:
        break;
    }
  }
}

export default withStyles(styles)(AccountInfo);
