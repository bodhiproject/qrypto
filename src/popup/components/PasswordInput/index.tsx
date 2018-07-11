import React from 'react';
import { TextField, withStyles } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';

const PasswordTextField: React.SFC<any> = ({ classes, classNames, placeholder, helperText, error, onChange }: any) => (
  <TextField
    className={cx(classes.passwordTextField, classNames)}
    required
    type="password"
    placeholder={placeholder}
    helperText={helperText}
    error={error}
    InputProps={{
      disableUnderline: true,
      classes: { input: classes.passwordFieldInput },
    }}
    onChange={onChange}
  />
);

export default withStyles(styles)(PasswordTextField);
