import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Typography, Button, withStyles } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';

import styles from './styles';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class AccountInfo extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
    hasRightArrow: PropTypes.boolean,
  };

  public handleClick = (id: string, event: React.MouseEvent<HTMLElement>) => {
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

  public render() {
    const { classes, hasRightArrow } = this.props;
    const { info } = this.props.store.walletStore;

    return info && (
      <div className={classes.root}>
        <Typography className={classes.acctName}>{'Default Account'}</Typography>
        <Typography className={classes.address}>{info.addrStr}</Typography>
        <div className={classes.amountContainer}>
          <Typography className={classes.tokenAmount}>{info.balance}</Typography>
          <Typography className={classes.token}>QTUM</Typography>
          {hasRightArrow && <KeyboardArrowRight className={classes.rightArrow} />}
        </div>
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
}
