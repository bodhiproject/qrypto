import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

import theme from '../../../config/theme';

const styles = {
  iconButton: {
    width: theme.icon.size,
    height: theme.icon.size,
  },
};

const BackButton = ({ store, history }) => (
  <Fragment>
    <IconButton onClick={() => history.push(store.ui.prevLocation)} style={styles.iconButton}>
      <ArrowBack style={{ fontSize: theme.font.md }} />
    </IconButton>
  </Fragment>
);

export default withRouter(inject('store')(observer(BackButton)));
