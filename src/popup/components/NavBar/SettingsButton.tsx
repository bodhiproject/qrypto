import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';

import theme from '../../../config/theme';

const styles = {
  iconButton: {
    width: theme.icon.size,
    height: theme.icon.size,
  },
  settingsButton: {
    fontSize: 18,
  },
};

@withRouter
@inject('store')
@observer
export default class SettingsButton extends Component {

  public onLogoutButtonClick = () => {
    this.props.store.walletStore.clearMnemonic();
    this.props.history.push('/import-mnemonic');
  }

  public render() {
    const { ui } = this.props.store;

    return (
      <Fragment>
        <IconButton
          aria-owns={ui.settingsMenuAnchor ? 'settingsMenu' : null}
          aria-haspopup="true"
          color="primary"
          onClick={(e) => ui.settingsMenuAnchor = e.currentTarget}
          style={styles.iconButton}
        >
          <Settings style={styles.settingsButton} />
        </IconButton>
        <Menu
          id="settingsMenu"
          anchorEl={ui.settingsMenuAnchor}
          open={Boolean(ui.settingsMenuAnchor)}
          onClose={() => ui.settingsMenuAnchor = null}
        >
          <MenuItem onClick={this.onLogoutButtonClick}>Logout</MenuItem>
        </Menu>
      </Fragment>
    );
  }
}
