import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';

import { Typography, Menu, MenuItem, IconButton, withStyles } from '@material-ui/core';
import { ArrowBack, Settings } from '@material-ui/icons';
import cx from 'classnames';

import DropDownMenu from '../DropDownMenu';
import AppStore from '../../stores/AppStore';
import QryNetwork from '../../../models/QryNetwork';
import styles from './styles';

interface IProps {
  classes: Record<string, string>;
  store?: AppStore;
  hasBackButton?: boolean;
  hasSettingsButton?: boolean;
  hasNetworkSelector?: boolean;
  isDarkTheme?: boolean;
  title: string;
}

const NavBar: React.SFC<IProps> = inject('store')(observer((props: IProps) => {
  const {
    classes,
    hasBackButton,
    hasSettingsButton,
    hasNetworkSelector,
    isDarkTheme,
    title,
    store: { navBarStore, sessionStore },
  }: any = props;

  return (
    <div className={classes.root}>
      <div className={classes.leftButtonsContainer}>
        {hasBackButton && <BackButton {...props} />}
        {hasSettingsButton && <SettingsButton {...props} />}
      </div>
      <div className={classes.locationContainer}>
        <Typography className={cx(classes.locationText, isDarkTheme ? 'white' : '')}>{title}</Typography>
      </div>
      {hasNetworkSelector && (
        <DropDownMenu
          onSelect={navBarStore.changeNetwork}
          selections={sessionStore.networks.map((net: QryNetwork) => net.name)}
          selectedIndex={sessionStore.networkIndex}
        />
      )}
    </div>
  );
}));

const BackButton: React.SFC<IProps> = ({ classes, isDarkTheme, store: { routerStore } }: any) => (
  <IconButton onClick={() => routerStore.goBack()} className={classes.backIconButton}>
    <ArrowBack className={cx(classes.backButton, isDarkTheme ? 'white' : '')} />
  </IconButton>
);

const SettingsButton: React.SFC<IProps> =
  observer(({ classes, store: { navBarStore }, isDarkTheme }: any) => (
  <Fragment>
    <IconButton
      aria-owns={navBarStore.settingsMenuAnchor ? 'settingsMenu' : undefined}
      aria-haspopup="true"
      color="primary"
      onClick={(e) => navBarStore.settingsMenuAnchor = e.currentTarget}
      className={classes.settingsIconButton}
    >
      <Settings className={cx(classes.settingsButton, isDarkTheme ? 'white' : '')} />
    </IconButton>
    <Menu
      id="settingsMenu"
      anchorEl={navBarStore.settingsMenuAnchor}
      open={Boolean(navBarStore.settingsMenuAnchor)}
      onClose={() => navBarStore.settingsMenuAnchor = undefined}
    >
      <MenuItem onClick={navBarStore.routeToSettings}>Settings</MenuItem>
      <MenuItem onClick={navBarStore.logout}>Logout</MenuItem>
    </Menu>
  </Fragment>
));

export default withStyles(styles)(NavBar);
