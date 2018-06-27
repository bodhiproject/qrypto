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
    const { ui } = this.props.store;

    return (
      <div>
        <IconButton
          aria-owns={ui.settingsMenuAnchor ? 'settingsMenu' : null}
          aria-haspopup="true"
          color="primary"
          onClick={(e) => ui.settingsMenuAnchor = e.currentTarget}
          style={{ width: 24, height: 24 }}
          disableRipple
        >
          <Settings style={{ fontSize: 18 }} />
        </IconButton>
        <Menu
          id="settingsMenu"
          anchorEl={ui.settingsMenuAnchor}
          open={Boolean(ui.settingsMenuAnchor)}
          onClose={() => ui.settingsMenuAnchor = null}
        >
          <MenuItem onClick={this.onLogoutButtonClick}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }
}
