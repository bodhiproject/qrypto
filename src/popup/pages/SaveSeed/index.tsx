import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import styles from './styles';
import NavBar from '../../components/NavBar';

@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class SaveSeed extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <NavBar hasBackButton title="Wallet Created" />
        <div className={classes.contentContainer}>

        </div>
      </div>
    );
  }
}
