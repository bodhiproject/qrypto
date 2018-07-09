import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Card, CardContent, withStyles } from '@material-ui/core';

import styles from './styles';
import AccountInfo from '../../../components/AccountInfo';

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class MainAccount extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public handleClick = (id: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    switch (id) {
      case 'mainCard': {
        this.props.store.routerStore.push('/account-detail');
        break;
      }
      default: {
        break;
      }
    }
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
