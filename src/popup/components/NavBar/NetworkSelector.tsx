import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

const styles = {
  networkButton: {
    
  },
};

@inject('store')
@observer
export default class NetworkSelector extends Component {

  public onNetworkSelectionClick = () => {
    // TODO: implement
  }

  public render() {
    return (
      <div>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          style={styles.networkButton}
          onClick={this.onNetworkSelectionClick}
         >
           Testnet
         </Button>
      </div>
    );
  }
}
