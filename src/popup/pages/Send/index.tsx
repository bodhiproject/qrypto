import * as React from 'react';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom'

class Send extends React.Component<any, {}> {

  handleCreate = () => {
    this.props.history.push('/sendconfirm')
  }
  
  public render(){
    return(
      <div>
        <h3>Send</h3>
        <h6>Sub-address 01</h6>
        <p>Qn....</p>
        <p>0.09999 QTUM</p>
        <Button variant="contained" color="primary" onClick={this.handleCreate}>
          Create
        </Button>
      </div>
    )
  }
}

export default withRouter(Send)