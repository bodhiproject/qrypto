import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Card, CardContent, withStyles } from '@material-ui/core';

import styles from './styles';
import AccountInfo from '../../../components/AccountInfo';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class MainAccount extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public handleClick = (id, event) => {
    event.stopPropagation();

    switch (id) {
      case 'mainCard': {
        this.props.history.push('/account-detail');
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

  public render() {
    const { classes } = this.props;
    const { info } = this.props.store.walletStore;

    if (!info) {
      return null;
    }

    return info && (
      <div>
        <Card raised id="mainCard" onClick={(e) => this.handleClick('mainCard', e)} className={classes.card}>
          <CardContent className={classes.cardContent}>
            <AccountInfo hasRightArrow />
          </CardContent>
        </Card>
      </div>
    );
  }
}
