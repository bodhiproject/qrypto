import * as React from 'react';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom'

class Send extends React.Component<any, {}> {

  handleCancel = () => {
    this.props.history.push('/send')
  }
  handleConfirm = () => {
    this.props.history.push('/accountdetail')
  }
  
  public render(){
    return(
      <div>
        <h3>SendConfirm</h3>
        <h6>Sub-address 01</h6>
        <p>From: Qn....</p>
        <p>To: Qn....</p>
        <p>Amount: 0.09999 QTUM</p>
        <Button variant="contained" color="primary" onClick={this.handleCancel}>
          CANCEL
        </Button>
        <Button variant="contained" color="primary" onClick={this.handleConfirm}>
          CONFIRM
        </Button>
      </div>
    )
  }
}

export default withRouter(Send)