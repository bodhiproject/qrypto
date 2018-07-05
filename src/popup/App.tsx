import React, { Component, Fragment } from 'react';
import { Provider as MobxProvider } from 'mobx-react';
import { observer } from 'mobx-react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';

import './App.scss';
import Signup from './pages/Signup';
import ImportMnemonic from './pages/ImportMnemonic';
import Login from './pages/Login';
import Home from './pages/Home';
import AccountDetail from './pages/AccountDetail';
import Send from './pages/Send';
import Receive from './pages/Receive';
import SendConfirm from './pages/SendConfirm';
import Loading from './components/Loading';
import store from '../stores/AppStore';
import theme from '../config/theme';

@observer
class App extends Component<IProps, IState> {

  public componentWillUnmount() {
    store.walletStore.stopGetInfoPolling();
  }

  public render() {

    return (
      <MobxProvider store={store}>
        <MuiThemeProvider theme={theme}>
          <Router>
            <Fragment>
              {/* TODO - this will later become:
              - if wallet does not exist in storage(which we will store in a state), route to the import/create mnemonic,
              -else route to login */}
              {store.walletStore.loading ? (
                <Redirect to="/loading" />
              ) : (
                <Redirect to="/signup" />
              )}

              <Route exact path="/loading" component={Loading} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/import" component={ImportMnemonic} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/home" component={Home} />
              <Route exact path="/account-detail" component={AccountDetail} />
              <Route exact path="/send" component={Send} />
              <Route exact path="/send-confirm" component={SendConfirm} />
              <Route exact path="/receive" component={Receive} />
            </Fragment>
          </Router>
        </MuiThemeProvider>
      </MobxProvider>
    );
  }
}

interface IProps {
  port: chrome.runtime.Port;
}

interface IState {
}

export default App;
