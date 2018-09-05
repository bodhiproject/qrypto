import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Router, Route, Switch } from 'react-router-dom';
import { SynchronizedHistory } from 'mobx-react-router';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

import Loading from './components/Loading';
import Login from './pages/Login';
import CreateWallet from './pages/CreateWallet';
import SaveMnemonic from './pages/SaveMnemonic';
import ImportWallet from './pages/ImportWallet';
import AccountLogin from './pages/AccountLogin';
import Settings from './pages/Settings';
import Home from './pages/Home';
import AccountDetail from './pages/AccountDetail';
import Send from './pages/Send';
import Receive from './pages/Receive';
import SendConfirm from './pages/SendConfirm';
import AddToken from './pages/AddToken';
import AppStore from './stores/AppStore';
import { MESSAGE_TYPE } from '../constants';

interface IProps {
  history: SynchronizedHistory;
  store?: AppStore;
}

@inject('store')
@observer
export default class MainContainer extends Component<IProps, {}> {
  public componentDidMount() {
    this.props.store!.mainContainerStore.init();
  }

  public componentWillUnmount() {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPE.LOGOUT });
  }

  public render() {
    const { history }: any = this.props;

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Router history={history}>
          <Switch>
            <Route exact path="/loading" component={Loading} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/create-wallet" component={CreateWallet} />
            <Route exact path="/save-mnemonic" component={SaveMnemonic} />
            <Route exact path="/import-wallet" component={ImportWallet} />
            <Route exact path="/account-login" component={AccountLogin} />
            <Route exact path="/settings" component={Settings} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/account-detail" component={AccountDetail} />
            <Route exact path="/send" component={Send} />
            <Route exact path="/send-confirm" component={SendConfirm} />
            <Route exact path="/receive" component={Receive} />
            <Route exact path="/add-token" component={AddToken} />
          </Switch>
        </Router>
        <UnexpectedErrorDialog />
      </div>
    );
  }
}

const UnexpectedErrorDialog: React.SFC<any> = inject('store')(observer(({ store: { mainContainerStore } }) => (
  <Dialog
    disableBackdropClick
    open={!!mainContainerStore.unexpectedError}
    onClose={() => mainContainerStore.unexpectedError = undefined}
  >
    <DialogTitle>Unexpected Error</DialogTitle>
    <DialogContent>
      <DialogContentText>{ mainContainerStore.unexpectedError }</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => mainContainerStore.unexpectedError = undefined} color="primary">Close</Button>
    </DialogActions>
  </Dialog>
)));
