import React from 'react';
import { Menu, MenuItem, Button, withStyles } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import PropTypes from 'prop-types';

import styles from './styles';

@withStyles(styles, { withTheme: true })
export default class DropDownMenu extends React.Component {

  public static propTypes = {
    classes: PropTypes.object.isRequired,
    onSelect: PropTypes.object.isRequired,
    selections: PropTypes.array,
    selectionIndex: PropTypes.integer,
  };

  public state = {
    anchorEl: null,
  };

  public onMenuItemClick = (i) => {
    this.props.onSelect(i);
    this.setState({ anchorEl: null });
  }

  public handleClose = () => {
    this.setState({ anchorEl: null });
  }

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
            <MenuItem onClick={ () => this.onMenuItemClick(i) }> {item} </MenuItem>
          ))}
        </Menu >
      </div>
    );
  }
}
