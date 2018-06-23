import * as React from 'react'
import { Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { NavBar } from '../../components/NavBar'


@withRouter
@inject('store')
@observer
export default class Send extends React.Component<any, {}> {

  handleCreate = () => {
    this.props.history.push('/send-confirm')
  }

  componentDidMount() {
    this.props.store.ui.prevLocation = '/account-detail'
  }
  
  public render(){
    const { walletStore } = this.props.store
    const { info } = walletStore

    return(
      <div>
        <NavBar hasBackButton={true} title={'Send Page'} />
        <div>
          <h6>{`<Account Name>`}</h6>
          <p>{info.addrStr}</p>
          <p>{info.balance} QTUM</p>
          <p>= {`<123... USD>`}</p>
        </div>
        <h4>Send to Address</h4>
        <input value={walletStore.sendToAddress} onChange={e => walletStore.sendToAddress = e.target.value} />
        <h4>Toke type</h4>
        <input value={walletStore.sendToTokenType} onChange={e => walletStore.sendToTokenType = e.target.value} />
        <h4>Value</h4>
        <input value={walletStore.sendToAmount} onChange={e => walletStore.sendToAmount = e.target.value} />
        <Button variant="contained" color="primary" onClick={this.handleCreate}>
          Create
        </Button>
      </div>
    )
  }
}
