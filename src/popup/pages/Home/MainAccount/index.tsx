import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Typography, Card, CardContent, Button, IconButton } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';

import theme from '../../../../config/theme';

const styles = {
  card: {
    cursor: 'pointer',
  },
  cardContent: {
    padding: theme.spacing.md,
    background: theme.palette.primary.main,
  },
  acctName: {
    fontSize: theme.font.md,
    fontWeight: 'bold',
    color: theme.palette.text.light,
    marginBottom: theme.spacing.unit,
  },
  address: {
    fontSize: theme.font.sm,
    color: theme.palette.text.light,
    marginBottom: theme.spacing.sm,
  },
  amountContainer: {
    width: '100%',
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    display: 'inline-flex',
  },
  tokenAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.palette.text.light,
    marginRight: theme.spacing.sm,
  },
  token: {
    fontSize: theme.font.sm,
    color: theme.palette.text.light,
    flex: 1
  },
  rightArrow: {
    fontSize: 20,
    color: theme.palette.text.light,
  },
};

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

    if (!info) {
      return null;
    }

    return info && (
      <div>
        <Card raised id="mainCard" onClick={(e) => handleClick('mainCard', e)} style={styles.card}>
          <CardContent style={styles.cardContent}>
            <Typography style={styles.acctName}>{'Default Account'}</Typography>
            <Typography style={styles.address}>{info.addrStr}</Typography>
            <div style={styles.amountContainer}>
              <Typography style={styles.tokenAmount}>{info.balance}</Typography>
              <Typography style={styles.token}>QTUM</Typography>
              <KeyboardArrowRight style={styles.rightArrow} />
            </div>
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
      </div>
    );
  }
}
