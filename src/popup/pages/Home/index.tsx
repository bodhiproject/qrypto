import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles, WithStyles } from '@material-ui/core';

import styles from './styles';
import NavBar from '../../components/NavBar';
import MainAccount from './MainAccount';

@inject('store')
@observer
class Home extends Component<WithStyles, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public componentDidMount() {
    this.props.store.walletStore.startPolling();
  }

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <NavBar hasSettingsButton hasNetworkSelector title="Home" />
        <div className={classes.content}>
          <MainAccount />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
