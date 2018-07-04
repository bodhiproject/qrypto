import React from 'react';
import { TextField, withStyles } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';

const PasswordTextField = withStyles(styles, { withTheme: true })(({ classes, classNames, placeholder, onChange }: any) => (
  <TextField
    className={cx(classes.passwordTextField, classNames)}
    required
    type="password"
    placeholder={placeholder}
    InputProps={{
      disableUnderline: true,
      classes: { input: classes.passwordFieldInput },
    }}
    onChange={onChange}
  />
));

export default PasswordTextField;
