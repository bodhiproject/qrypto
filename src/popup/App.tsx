import React, { Component } from 'react';
import { Provider as MobxProvider } from 'mobx-react';
import { observer } from 'mobx-react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';

import './App.scss';
import { store } from '../stores/AppStore';
import theme from '../config/theme';
import MainContainer from './MainContainer';

const browserHistory = createBrowserHistory();
const routerStore = new RouterStore();
store.routerStore = routerStore;
const history = syncHistoryWithStore(browserHistory, routerStore);
history.push('/create-wallet');
const stores = { store, routerStore };

@observer
class App extends Component<IProps, IState> {

  public componentWillUnmount() {
    store.walletStore.stopPolling();
  }

  public render() {
    return (
      <MobxProvider {...stores}>
        <MuiThemeProvider theme={theme}>
          <MainContainer history={history} />
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
