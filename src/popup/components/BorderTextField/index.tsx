import React from 'react';
import { TextField, withStyles, Typography } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';
import { handleEnterPress } from '../../../utils';

const BorderTextField: React.SFC<any> = ({
  classes,
  classNames,
  placeholder,
  error,
  errorText,
  onChange,
  onEnterPress,
}: any) => (
  <div className={cx(classes.container, classNames)}>
    <TextField
      className={classes.textField}
      required
      type="text"
      placeholder={placeholder}
      InputProps={{
        disableUnderline: true,
        classes: { input: classes.textFieldInput },
      }}
      onChange={onChange}
      onKeyPress={(e) => handleEnterPress(e, onEnterPress)}
    />
    {error && errorText && (
      <Typography className={classes.errorText}>{errorText}</Typography>
    )}
  </div>
);

export default withStyles(styles)(BorderTextField);
