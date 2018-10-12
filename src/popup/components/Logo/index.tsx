import React from 'react';
import { Typography, withStyles } from '@material-ui/core';
const extension = require('extensionizer');

import styles from './styles';

const Logo: React.SFC<any> = ({ classes }: any) => (
  <div className={classes.logoContainer}>
    <img className={classes.logo} src={extension.runtime.getURL('images/logo.png')} alt={'Logo'} />
    <Typography className={classes.logoText}>Qrypto</Typography>
  </div>
);

export default withStyles(styles)(Logo);
