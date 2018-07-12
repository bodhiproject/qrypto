import React, { Component } from 'react';
import { Provider as MobxProvider } from 'mobx-react';
import { observer } from 'mobx-react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { syncHistoryWithStore } from 'mobx-react-router';
import { createBrowserHistory } from 'history';

import theme from './theme';
import { store } from '../stores/AppStore';
import MainContainer from './MainContainer';

// Sync history with MobX router
const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, store.routerStore);
history.push('/create-wallet');

interface IProps {
  port: chrome.runtime.Port;
}

interface IState {
}

@observer
class App extends Component<IProps, IState> {
  public componentWillUnmount() {
    store.walletStore.stopPolling();
  }

  public render() {
    return (
      <MobxProvider store={store} >
        <MuiThemeProvider theme={theme}>
          <MainContainer history={history} />
        </MuiThemeProvider>
      </MobxProvider>
    );
  }
}

export default App;
