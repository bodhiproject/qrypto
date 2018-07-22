import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';

const Loading: React.SFC<any> = ({ classes }: any) => (
  <div className={cx(classes.root, 'loading')}>
    <div className={classes.container}>
      <Typography className={classes.text}>Loading...</Typography>
      <div className={classes.anim9}></div>
    </div>
  </div>
);

export default withStyles(styles)(Loading);
