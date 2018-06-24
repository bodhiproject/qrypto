import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import { Settings } from '@material-ui/icons'

import MainAccount from './MainAccount'

@inject('store')
@observer
class Home extends React.Component<any, {}> {

  public goToDetail = () => {
    this.props.history.push('/account-detail')
  }

  public onLogoutButtonClick = () => {
    this.props.store.walletStore.clearMnemonic()
    this.props.history.push('/import-mnemonic')
  }

  public render() {
    const { homeStore } = this.props.store

    return (
      <div style={{ margin: 16 }}>
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
        <MainAccount />
      </div>
    )
  }
}

export default Home
// TODO ??why doesn't this work, why do I have to put the click on the component itself
{/* <MainAccount onClick={this.goToDetail}/> */}
// export default withRouter(Home)
