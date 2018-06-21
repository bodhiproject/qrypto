import * as React from 'react';
import {
  withRouter
} from 'react-router-dom'

class MainAccount extends React.Component<any, {}> {

  handleClick = () => {
    this.props.history.push('/accountdetail')
  }
  
  public render(){
    return(
      <div onClick={this.handleClick}>
        <h3>MainAccount</h3>
        <h6>Stormtrooper</h6>
        <p>Qn....</p>
        0.09999 QTUM
      </div>
    )
  }
}

export default withRouter(MainAccount)