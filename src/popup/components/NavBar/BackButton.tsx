import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

const BackButton = ({ store, history }) => (
  <div>
    <IconButton
      onClick={(e) => history.push(store.ui.prevLocation)}
      style={{ width: 24, height: 24 }}
      disableRipple
    >
      <ArrowBack style={{ fontSize: 14 }} />
    </IconButton>
  </div>
);

export default withRouter(inject('store')(observer(BackButton)));
