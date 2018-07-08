import React from 'react';
import { TextField as _TextField, withStyles } from '@material-ui/core';
import cx from 'classnames';

import styles from './styles';

const TextField = withStyles(styles, { withTheme: true })(({ classes, classNames, placeholder, helperText, error, onChange }: any) => (
  <_TextField
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
));

export default TextField;
