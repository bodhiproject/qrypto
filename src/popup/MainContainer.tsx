import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';

import CreateWallet from './pages/CreateWallet';
import SaveMnemonic from './pages/SaveMnemonic';
import ImportMnemonic from './pages/ImportMnemonic';
import Login from './pages/Login';
import Home from './pages/Home';
import AccountDetail from './pages/AccountDetail';
import Send from './pages/Send';
import Receive from './pages/Receive';
import SendConfirm from './pages/SendConfirm';
import Loading from './components/Loading';

@inject('store')
@observer
export default class MainContainer extends Component<IProps, IState> {
  public render() {
    const { loading } = this.props.store.walletStore;

    return (
      <Router>
        <Fragment>
          {/* TODO - this will later become:
          - if wallet does not exist in storage(which we will store in a state), route to the import/create mnemonic,
          -else route to login */}
          {loading ? (
            <Redirect to="/loading" />
          ) : (
            <Redirect to="/create-wallet" />
          )}

          <Route exact path="/loading" component={Loading} />
          <Route exact path="/create-wallet" component={CreateWallet} />
          <Route exact path="/save-mnemonic" component={SaveMnemonic} />
          <Route exact path="/import" component={ImportMnemonic} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/account-detail" component={AccountDetail} />
          <Route exact path="/send" component={Send} />
          <Route exact path="/send-confirm" component={SendConfirm} />
          <Route exact path="/receive" component={Receive} />
        </Fragment>
      </Router>
    );
  }
}

interface IProps {
}

interface IState {
}
