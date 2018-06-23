import * as React from 'react';
import { networks, Wallet, Insight} from 'qtumjs-wallet'
import { Redirect, withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import { inject, observer } from 'mobx-react';

@withRouter
@inject('store')
@observer
class ImportMnemonic extends React.Component<{}, IState> {

  public render(){ 
    console.log("render props:", this.props)
    const { walletStore } = this.props.store

    return(
      <div>
        <h3>ImportMnemonic Page</h3>
        <input type="text" onChange={(e) => walletStore.mnemonic = e.target.value} value={walletStore.mnemonic} />
        <Button variant="contained" color="primary" onClick={this.recoverAndGoToHomePage}>
          Import Wallet
        </Button>
      </div>  
    )
  }

  public recoverAndGoToHomePage = () => {
    const { store: { walletStore }, history } = this.props
    walletStore.handleRecover ()
    history.push('/')
  }
}

interface IState {
  walletStore: any
  history: any
}

export default ImportMnemonic 