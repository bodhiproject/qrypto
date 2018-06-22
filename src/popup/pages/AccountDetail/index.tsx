import * as React from 'react';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react';

@withRouter
@inject('store')
@observer
export default class AccountDetail extends React.Component<any, {}> {

  goToSend = () => {
    this.props.history.push('/send')
  }

  goToReceive = () => {
    this.props.history.push('/receive')
  }
  
  public render(){
    const { info } = this.props.store.walletStore
    return(
      <div>
        <h3>Account Detail Page</h3>
        <h6>{`<Account Name>`}</h6>
        <p>{info.addrStr}</p>
        <p>{info.balance} QTUM</p>
        <p>= {`<123... USD>`}</p>
        <Button variant="contained" color="primary" onClick={this.goToSend}>
          SEND
        </Button>
        <Button variant="contained" color="primary" onClick={this.goToReceive}>
          RECEIVE
        </Button>
      </div>
    )
  }
}
