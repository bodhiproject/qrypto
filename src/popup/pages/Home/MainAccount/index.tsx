import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Card, CardContent, withStyles, WithStyles } from '@material-ui/core';

import styles from './styles';
import AccountInfo from '../../../components/AccountInfo';
import AppStore from '../../../../stores/AppStore';

interface IProps {
  classes: Record<string, string>;
  store?: AppStore;
}

@inject('store')
@observer
class MainAccount extends Component<WithStyles & IProps, {}> {
  public handleClick = (id: string, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    switch (id) {
      case 'mainCard': {
        this.props.store!.routerStore.push('/account-detail');
        break;
      }
      default: {
        break;
      }
    }
  }

  public render() {
    const { classes } = this.props;
    const { info } = this.props.store!.sessionStore;

    if (!info) {
      return null;
    }

    return (
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

export default withStyles(styles)(MainAccount);
