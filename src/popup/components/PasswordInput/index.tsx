import React from 'react';
import { TextField, withStyles } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';
import { handleEnterPress } from '../../../utils';

const PasswordTextField: React.SFC<any> = ({
  classes,
  classNames,
  placeholder,
  helperText,
  error,
  onChange,
  onEnterPress,
}: any) => (
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
    onKeyPress={(e) => handleEnterPress(e, onEnterPress)}
  />
);

export default withStyles(styles)(PasswordTextField);
