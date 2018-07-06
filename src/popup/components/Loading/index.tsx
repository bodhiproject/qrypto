import * as React from 'react';
import { Typography, withStyles } from '@material-ui/core';

import styles from './styles';

const Loading = (props: any) => (
  <div className={props.classes.root}>
    <Typography className={props.classes.text}>Loading...</Typography>
    <div className={props.classes.anim9}>
    </div>
  </div>
);

export default withStyles(styles)(Loading);
