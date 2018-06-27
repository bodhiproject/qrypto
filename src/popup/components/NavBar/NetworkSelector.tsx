import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, withStyles } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';

import theme from '../../../config/theme';

const styles = {
  networkButton: {
    minWidth: 0,
    minHeight: 0,
    padding: `0 ${theme.spacing.sm}`,
    color: theme.palette.text.primary,
    textTransform: 'none',
  },
};

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class NetworkSelector extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

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
          className={this.props.classes.networkButton}
          onClick={this.onNetworkSelectionClick}
         >
           Testnet
           <ArrowDropDown /> 
         </Button>
      </div>
    );
  }
}
