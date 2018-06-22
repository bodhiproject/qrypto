import * as React from 'react';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom'

@withRouter
export default class Send extends React.Component<any, {}> {

  handleCreate = () => {
    this.props.history.push('/sendconfirm')
  }
  
  public render(){
    const { info } = this.props.store.walletStore
    
    return(
      <div>
        <h3>Send Page</h3>
        <h6>{`<Account Name>`}</h6>
        <p>{info.addrStr}</p>
        <p>{info.balance} QTUM</p>
        <p>= {`<123... USD>`}</p>
        <Button variant="contained" color="primary" onClick={this.handleCreate}>
          Create
        </Button>
      </div>
    )
  }
}
