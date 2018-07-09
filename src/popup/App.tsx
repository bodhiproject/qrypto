import React, { Component } from 'react';
import { Provider as MobxProvider } from 'mobx-react';
import { observer } from 'mobx-react';
import { MuiThemeProvider } from '@material-ui/core/styles';

import './App.scss';
import MainContainer from './MainContainer';
import { store } from '../stores/AppStore';
import theme from '../config/theme';

@observer
class App extends Component<IProps, IState> {

  public componentWillUnmount() {
    store.walletStore.stopPolling();
  }

  public render() {
    return (
      <MobxProvider store={store}>
        <MuiThemeProvider theme={theme}>
          <MainContainer />
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
