import React, { Component } from 'react';
import { Menu, MenuItem, Button, withStyles, WithStyles } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';

import styles from './styles';

interface IProps {
  classes: Record<string, string>;
  onSelect?: (idx: number) => any;
  selections: string[];
  selectedIndex: number;
}

interface IState {
  anchorEl: any;
}

class DropDownMenu extends Component<WithStyles & IProps, IState> {

  public state: IState = {
    anchorEl: undefined,
  };

  public render() {
    const { classes, selections, selectedIndex } = this.props;

    return (
      <div>
        <Button
          aria-haspopup="true"
          color="secondary"
          variant="contained"
          size="small"
          className={classes.menuButton}
          onClick={(e) => this.setState({ anchorEl: e.currentTarget }) }
        >
          {selections[selectedIndex]}
          <ArrowDropDown />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={ this.state.anchorEl }
          open={Boolean(this.state.anchorEl)}
          onClose={() => this.setState({ anchorEl: null }) }
        >
          {selections.map((item, i) => (
            <MenuItem key={i} onClick={() => this.onMenuItemClick(i)}> {item} </MenuItem>
          ))}
        </Menu >
      </div>
    );
  }

  private onMenuItemClick = (i: number) => {
    if (this.props.onSelect) {
      this.props.onSelect(i);
    }
    this.setState({ anchorEl: null });
  }
}

export default withStyles(styles)(DropDownMenu);
