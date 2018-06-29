import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Typography, Menu, MenuItem, Button, IconButton, withStyles } from '@material-ui/core';
import { ArrowBack, Settings, ArrowDropDown } from '@material-ui/icons';

import styles from './styles';

@withStyles(styles, { withTheme: true })
@withRouter
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
    title: '',
  };

  public onLogoutButtonClick = () => {
    this.props.store.walletStore.clearMnemonic();
    this.props.history.push('/import-mnemonic');
  }

  public onNetworkSelectionClick = () => {
    // TODO: implement
  }

  public render() {
    const { classes, history, hasBackButton, hasSettingsButton, hasNetworkSelector, title, isDarkTheme } = this.props;
    const { settingsMenuAnchor } = this.props.store.ui;

    return (
      <div className={classes.root}>
        <div className={classes.leftButtonsContainer}>
          {hasBackButton && <BackButton classes={classes} store={store} history={history} />}
          {hasSettingsButton && (
            <SettingsButton
              isDarkTheme={isDarkTheme}
              classes={classes}
              store={store}
              settingsMenuAnchor={settingsMenuAnchor}
              onLogoutButtonClick={this.onLogoutButtonClick}
            />
          )}
        </div>
        <div className={classes.locationContainer}>
          <Typography className={classes[`locationText${isDarkTheme ? 'White' : ''}`]}>{title}</Typography>
        </div>
        {hasNetworkSelector && (
          <NetworkSelector classes={classes} onNetworkSelectionClick={this.onNetworkSelectionClick} />
        )}
      </div>
    );
  }
}

const BackButton = ({ classes, store, history, isDarkTheme }) => (
  <IconButton onClick={() => history.push(store.ui.prevLocation)} className={classes.backIconButton}>
    <ArrowBack className={classes[`backButton${isDarkTheme ? 'White' : ''}`]} />
  </IconButton>
);

const SettingsButton = ({ classes, store, settingsMenuAnchor, onLogoutButtonClick, isDarkTheme }) => (
  <Fragment>
    <IconButton
      aria-owns={settingsMenuAnchor ? 'settingsMenu' : null}
      aria-haspopup="true"
      color="primary"
      onClick={(e) => store.ui.settingsMenuAnchor = e.currentTarget}
      className={classes.settingsIconButton}
    >
      <Settings className={classes[`settingsButton${isDarkTheme ? 'White' : ''}`]} />
    </IconButton>
    <Menu
      id="settingsMenu"
      anchorEl={settingsMenuAnchor}
      open={Boolean(settingsMenuAnchor)}
      onClose={() => store.ui.settingsMenuAnchor = null}
    >
      <MenuItem onClick={onLogoutButtonClick}>Logout</MenuItem>
    </Menu>
  </Fragment>
);

const NetworkSelector = ({ classes, onNetworkSelectionClick }) => (
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
