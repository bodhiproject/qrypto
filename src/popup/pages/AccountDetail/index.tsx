import * as React from 'react';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom'

class AccountDetail extends React.Component<any, {}> {

  goToSend = () => {
    this.props.history.push('/send')
  }

  goToReceive = () => {
    this.props.history.push('/receive')
  }
  
  public render(){
    return(
      <div>
        <h3>AccountDetail</h3>
        <h6>Sub-address 01</h6>
        <p>Qn....</p>
        <p>0.09999 QTUM</p>
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

export default withRouter(AccountDetail)