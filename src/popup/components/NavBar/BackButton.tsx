import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { ArrowBack } from '@material-ui/icons';

const BackButton = ({ store, history }) => (
  <div onClick={() => history.push(store.ui.prevLocation)}>
    <ArrowBack style={{ marginRight: 8 }} />
  </div>
);

export default withRouter(inject('store')(observer(BackButton)));
