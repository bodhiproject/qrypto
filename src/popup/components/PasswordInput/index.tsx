import React from 'react';
import { TextField, Typography, withStyles } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';
import { handleEnterPress } from '../../../utils';

const PasswordTextField: React.SFC<any> = ({
  classes,
  classNames,
  placeholder,
  helperText,
  error,
  errorText,
  onChange,
  onEnterPress,
}: any) => (
  <div className={cx(classes.container, classNames)}>
    <TextField
      className={classes.textField}
      required
      type="password"
      placeholder={placeholder}
      helperText={helperText}
      error={error}
      InputProps={{
        disableUnderline: true,
        classes: { input: classes.input },
      }}
      onChange={onChange}
      onKeyPress={(e) => handleEnterPress(e, onEnterPress)}
    />
    {error && errorText && (
      <Typography className={classes.errorText}>{errorText}</Typography>
    )}
  </div>
);

export default withStyles(styles)(PasswordTextField);
