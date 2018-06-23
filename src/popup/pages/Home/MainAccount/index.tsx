import * as React from 'react'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

@withRouter
@inject('store')
@observer
export default class MainAccount extends React.Component<any, {}> {

  handleClick = () => {
    this.props.history.push('/account-detail')
  }

  componentWillUnmount() {
    this.props.store.ui.prevLocation = '/'
  }
  
  public render(){
    const { info } = this.props.store.walletStore
    console.log("info:", info)
    return(
      <div onClick={this.handleClick}>
        <h3>Main Account Page</h3>
        <h6>{`<Account Name>`}</h6>
        <p>{info.addrStr}</p>
        <p>{info.balance} QTUM</p>
        <p>= {`<123... USD>`}</p>
      </div>
    )
  }
}
