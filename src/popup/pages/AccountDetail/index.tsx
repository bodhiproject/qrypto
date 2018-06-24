import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { NavBar } from '../../components/NavBar'

@withRouter
@inject('store')
@observer
export default class AccountDetail extends Component<any, {}> {

  public goToSend = () => {
    this.props.history.push('/send')
  }

  public goToReceive = () => {
    this.props.history.push('/receive')
  }

  public componentDidMount() {
    this.props.store.ui.prevLocation = '/'
  }

  public render() {
    const { info } = this.props.store.walletStore
    return(
      <div>
        <NavBar hasBackButton={true} title={'Account Detail Page'} />
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
