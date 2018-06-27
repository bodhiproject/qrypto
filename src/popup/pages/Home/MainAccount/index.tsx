import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Typography, Card, CardContent, Button, IconButton } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';

import theme from '../../../../config/theme';

const styles = {
  card: {
    cursor: 'pointer',
    borderRadius: theme.border.radius,
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
    marginBottom: theme.spacing.md,
  },
  amountContainer: {
    width: '100%',
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    display: 'inline-flex',
  },
  tokenAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.palette.text.light,
    marginRight: theme.spacing.xs,
  },
  token: {
    fontSize: theme.font.sm,
    color: theme.palette.text.light,
    flex: 1,
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  rightArrow: {
    fontSize: 22,
    color: theme.palette.text.light,
    alignSelf: 'center',
  },
  actionButtonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: `${theme.spacing.unit} ${theme.spacing.sm}`,
    marginRight: theme.spacing.xs,
    fontSize: theme.font.sm,
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
            <div style={styles.actionButtonsContainer}>
              <Button
                id="sendButton"
                color="secondary"
                variant="raised"
                size="small"
                onClick={(e) => handleClick('sendButton', e)}
                style={styles.actionButton}
               >
                 Send
               </Button>
              <Button
                id="receiveButton"
                color="secondary"
                variant="raised"
                size="small"
                onClick={(e) => handleClick('receiveButton', e)}
                style={styles.actionButton}
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
