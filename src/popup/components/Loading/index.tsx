import React from 'react';
import { Typography, withStyles } from '@material-ui/core';

import styles from './styles';

const Loading = withStyles(styles)(({ classes, loading }: any) => (
  <div className={classes.root} style={{
    opacity: loading ? 1 : 0,
    display: loading ? 'block' : 'none',
  }}>
    <Typography className={classes.text}>Loading...</Typography>
    <div className={classes.anim9}>
    </div>
  </div>
));

export default Loading;
