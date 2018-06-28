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

const BackButton = ({ store, history, fontColor }) => (
  <Fragment>
    <IconButton
      style={styles.iconButton}
      onClick={() => history.push(store.ui.prevLocation)}>
      <ArrowBack
        style={{
          fontSize: theme.font.md,
          ...(fontColor ? {color: fontColor} : {}),
        }}
      />
    </IconButton>
  </Fragment>
);

export default withRouter(inject('store')(observer(BackButton)));
