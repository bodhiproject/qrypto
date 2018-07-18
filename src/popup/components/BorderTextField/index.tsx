import React from 'react';
import { TextField, withStyles } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';
import { handleEnterPress } from '../../../utils';

const BorderTextField: React.SFC<any> = ({
  classes,
  classNames,
  placeholder,
  helperText,
  error,
  onChange,
  onEnterPress,
}: any) => (
  <TextField
    className={cx(classes.textField, classNames)}
    required
    type="text"
    placeholder={placeholder}
    helperText={helperText}
    error={error}
    InputProps={{
      disableUnderline: true,
      classes: { input: classes.textFieldInput },
    }}
    onChange={onChange}
    onKeyPress={(e) => handleEnterPress(e, onEnterPress)}
  />
);

export default withStyles(styles)(BorderTextField);
