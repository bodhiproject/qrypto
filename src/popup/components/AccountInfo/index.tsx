import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Typography, Button, withStyles, WithStyles } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';

import styles from './styles';
import AppStore from '../../../stores/AppStore';

interface IProps {
  classes: Record<string, string>;
  hasRightArrow: boolean;
  store: AppStore;
}

@inject('store')
@observer
class AccountInfo extends Component<WithStyles & IProps, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
    hasRightArrow: PropTypes.bool,
  };

  public handleClick = (id: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    const location = {
      mainCard: '/account-detail',
      sendButton: '/send',
      receiveButton: '/receive',
    }[id];
    this.props.store.routerStore.push(location);
  }

  public render() {
    const { classes, hasRightArrow } = this.props;
    const { loggedInAccount, info, balanceUSD } = this.props.store.walletStore;

    return info && (
      <div className={classes.root}>
        <Typography className={classes.acctName}>{loggedInAccount!.name}</Typography>
        <Typography className={classes.address}>{info.addrStr}</Typography>
        <div className={classes.amountContainer}>
          <Typography className={classes.tokenAmount}>{info.balance}</Typography>
          <Typography className={classes.token}>QTUM</Typography>
          {hasRightArrow && <KeyboardArrowRight className={classes.rightArrow} />}
        </div>
        <Typography className={classes.balanceUSD}>${balanceUSD} USD</Typography>
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

export default withStyles(styles)(AccountInfo);
