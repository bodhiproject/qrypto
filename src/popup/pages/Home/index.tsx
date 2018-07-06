import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';

import styles from './styles';
import NavBar from '../../components/NavBar';
import MainAccount from './MainAccount';

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class Home extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public componentDidMount() {
    this.props.store.walletStore.startPolling();
  }

  public render() {
    const { classes } = this.props;

    return (
      <div>
        <NavBar hasSettingsButton hasNetworkSelector title="Home" />
        <div className={classes.content}>
          <MainAccount />
        </div>
      </div>
    );
  }
}
