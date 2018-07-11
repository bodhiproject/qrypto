import React, { Props } from 'react';
import { TextField, withStyles } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';

const BorderTextField = ({ classes, classNames, placeholder, helperText, error, onChange }: Props) => (
  <TextField
    className={cx(classes.textField, classNames)}
    required
    type="text"
    placeholder={placeholder}
    helperText={helperText}
    error={error}
    onChange={onChange}
    InputProps={{
      disableUnderline: true,
      classes: { input: classes.textFieldInput },
    }}
  />
);

export default withStyles(styles)(BorderTextField);
