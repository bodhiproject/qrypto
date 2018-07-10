import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { Typography, Menu, MenuItem, Button, IconButton, withStyles } from '@material-ui/core';
import { ArrowBack, Settings, ArrowDropDown } from '@material-ui/icons';
import cx from 'classnames';

import styles from './styles';

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class NavBar extends Component {
  public static propTypes = {
    classes: PropTypes.object.isRequired,
    hasBackButton: PropTypes.boolean,
    hasSettingsButton: PropTypes.boolean,
    hasNetworkSelector: PropTypes.boolean,
    isDarkTheme: PropTypes.boolean,
  };

  public static defaultProps = {
    hasBackButton: false,
    hasSettingsButton: false,
    hasNetworkSelector: false,
    isDarkTheme: false,
    title: '',
  };

  public onNetworkSelectionClick = () => {
    // TODO: implement
  }

  public render() {
    const { classes, hasBackButton, hasSettingsButton, hasNetworkSelector, title, isDarkTheme }: any = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.leftButtonsContainer}>
          {hasBackButton && <BackButton {...this.props} />}
          {hasSettingsButton && <SettingsButton {...this.props} />}
        </div>
        <div className={classes.locationContainer}>
          <Typography className={cx(classes.locationText, isDarkTheme ? 'white' : '')}>{title}</Typography>
        </div>
        {hasNetworkSelector && (
          <NetworkSelector classes={classes} onNetworkSelectionClick={this.onNetworkSelectionClick} />
        )}
      </div>
    );
  }
}

const BackButton = ({ classes, isDarkTheme, store: { routerStore } }: any) => (
  <IconButton onClick={() => routerStore.goBack()} className={classes.backIconButton}>
    <ArrowBack className={cx(classes.backButton, isDarkTheme ? 'white' : '')} />
  </IconButton>
);

const SettingsButton = observer(({ classes, store: { ui, walletStore }, isDarkTheme }: any) => (
  <Fragment>
    <IconButton
      aria-owns={ui.settingsMenuAnchor ? 'settingsMenu' : null}
      aria-haspopup="true"
      color="primary"
      onClick={(e) => ui.settingsMenuAnchor = e.currentTarget}
      className={classes.settingsIconButton}
    >
      <Settings className={cx(classes.settingsButton, isDarkTheme ? 'white' : '')} />
    </IconButton>
    <Menu
      id="settingsMenu"
      anchorEl={ui.settingsMenuAnchor}
      open={Boolean(ui.settingsMenuAnchor)}
      onClose={() => ui.settingsMenuAnchor = null}
    >
      <MenuItem onClick={walletStore.logout}>Logout</MenuItem>
    </Menu>
  </Fragment>
));

const NetworkSelector = ({ classes, onNetworkSelectionClick }: any) => (
  <Button
    color="secondary"
    variant="contained"
    size="small"
    className={classes.networkButton}
    onClick={onNetworkSelectionClick}
  >
    Testnet
    <ArrowDropDown />
  </Button>
);
