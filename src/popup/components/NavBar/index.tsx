import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { Typography, Menu, MenuItem, Button, IconButton, withStyles } from '@material-ui/core';
import { ArrowBack, Settings, ArrowDropDown } from '@material-ui/icons';
import cx from 'classnames';

import styles from './styles';
import AppStore from '../../../stores/AppStore';

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
  const { classes, hasBackButton, hasSettingsButton, hasNetworkSelector, isDarkTheme, title } = props;
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
        <NetworkSelector {...props} />
      )}
    </div>
  );
}));

const BackButton: React.SFC<IProps> = ({ classes, isDarkTheme, store: { routerStore } }: any) => (
  <IconButton onClick={() => routerStore.goBack()} className={classes.backIconButton}>
    <ArrowBack className={cx(classes.backButton, isDarkTheme ? 'white' : '')} />
  </IconButton>
);

const SettingsButton: React.SFC<IProps> = observer(({ classes, store: { ui, walletStore }, isDarkTheme }: any) => (
  <Fragment>
    <IconButton
      aria-owns={ui.settingsMenuAnchor ? 'settingsMenu' : undefined}
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
      onClose={() => ui.settingsMenuAnchor = undefined}
    >
      <MenuItem onClick={walletStore.logout}>Logout</MenuItem>
    </Menu>
  </Fragment>
));

const NetworkSelector: React.SFC<IProps> = ({ classes }: any) => (
  <Button
    color="secondary"
    variant="contained"
    size="small"
    className={classes.networkButton}
  >
    Testnet
    <ArrowDropDown />
  </Button>
);

export default withStyles(styles)(NavBar);
