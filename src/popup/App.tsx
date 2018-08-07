import React, { Component } from 'react';
import { Provider as MobxProvider, observer } from 'mobx-react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { syncHistoryWithStore } from 'mobx-react-router';
import { createBrowserHistory } from 'history';

import theme from './theme';
import { store } from './stores/AppStore';
import MainContainer from './MainContainer';

// Sync history with MobX router
const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, store.routerStore);
history.push('/login');

interface IProps {
  port: chrome.runtime.Port;
}

interface IState {
}

@observer
class App extends Component<IProps, IState> {
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
