import React from 'react';
import { TextField, withStyles } from '@material-ui/core';

import styles from './styles';

const PasswordTextField = withStyles(styles, { withTheme: true })(({ classes, placeholder, onChange, error }: any) => (
  <TextField
    className={classes.passwordTextField}
    required
    type="password"
    placeholder={placeholder}
    InputProps={{
      disableUnderline: true,
      classes: { input: classes.passwordFieldInput },
    }}
    onChange={onChange}
    error={error}
  />
));

export default PasswordTextField;
