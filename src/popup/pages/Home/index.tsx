import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import styles from './styles';
import NavBar from '../../components/NavBar';
import MainAccount from './MainAccount';

@withStyles(styles, { withTheme: true })
export default class Home extends Component<any, {}> {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
  };

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
// TODO ??why doesn't this work, why do I have to put the click on the component itself
{/* <MainAccount onClick={this.goToDetail}/> */}
// export default withRouter(Home)

// public goToDetail = () => {
//   this.props.history.push('/account-detail');
// }
