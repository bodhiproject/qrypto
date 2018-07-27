import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Typography, Select, MenuItem, withStyles, WithStyles  } from '@material-ui/core';
import { map } from 'lodash';

import styles from './styles';
import NavBar from '../../components/NavBar';
import AppStore from '../../stores/AppStore';
import { SessionLogoutInterval, sliArray } from '../../../models/SessionLogoutInterval';

interface IProps {
  classes: Record<string, string>;
  store: AppStore;
}

@inject('store')
@observer
class Settings extends Component<WithStyles & IProps, {}> {
  public render() {
    const { classes } = this.props;

    return(
      <div className={classes.root}>
        <NavBar hasBackButton title="Settings" />
        <div className={classes.contentContainer}>
          <div className={classes.fieldsContainer}>
            <SliField {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

const SliField = observer(({ classes, store: { sessionStore } }: any) => (
  <div className={classes.fieldContainer}>
    <Heading name="Session Logout Interval" />
    <div className={classes.fieldContentContainer}>
      <Select
        className={classes.select}
        inputProps={{ name: 'sessionLogoutInterval', id: 'sessionLogoutInterval'}}
        disableUnderline
        value={sessionStore.sessionLogoutInterval}
        onChange={(event) => sessionStore.changeSessionLogoutInterval(event.target.value)}
      >
      {map(sliArray, (sli: SessionLogoutInterval) =>
        <MenuItem key={sli.interval} value={sli.interval}>
          <Typography className={classes.selectTypography}>{sli.name}</Typography>
        </MenuItem>,
      )}
      </Select>
    </div>
  </div>
));

const Heading = withStyles(styles, { withTheme: true })(({ classes, name }: any) => (
  <Typography className={classes.fieldHeading}>{name}</Typography>
));

export default withStyles(styles)(Settings);
