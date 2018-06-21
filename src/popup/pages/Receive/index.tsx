import * as React from 'react';
import {
  withRouter
} from 'react-router-dom'

class Receive extends React.Component<any, {}> {
  
  public render(){
    return(
      <div>
        <h3>Receive</h3>
        <h6>Sub-address 01</h6>
        <p>Qn....</p>
        <p>0.09999 QTUM</p>
      </div>
    )
  }
}

export default withRouter(Receive)