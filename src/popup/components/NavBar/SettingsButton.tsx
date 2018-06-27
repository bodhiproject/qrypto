import React, { Component } from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
export default class SettingsButton extends Component {

  public onLogoutButtonClick = () => {
    this.props.store.walletStore.clearMnemonic();
    this.props.history.push('/import-mnemonic');
  }

  public render() {
    const { homeStore } = this.props.store;

    return (
      <div>
        <div style={{ textAlign: 'right' }}>
          <IconButton
            aria-owns={homeStore.settingsMenuAnchor ? 'settingsMenu' : null}
            aria-haspopup="true"
            color="primary"
            onClick={(e) => homeStore.settingsMenuAnchor = e.currentTarget}
          >
            <Settings />
          </IconButton>
        </div>
        <Menu
          id="settingsMenu"
          anchorEl={homeStore.settingsMenuAnchor}
          open={Boolean(homeStore.settingsMenuAnchor)}
          onClose={() => homeStore.settingsMenuAnchor = null}
        >
          <MenuItem onClick={this.onLogoutButtonClick}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }
}
