import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import NavBar from '../../components/NavBar';

@inject('store')
@observer
export default class Receive extends Component<any, {}> {

  public componentDidMount() {
    this.props.store.ui.prevLocation = '/account-detail';
  }

  public render() {
    const { info } = this.props.store.walletStore;

    return(
      <div>
        <NavBar hasBackButton={true} title={'Receive Page'} />
        <h6>{`<Account Name>`}</h6>
        <p>{info.addrStr}</p>
        <p>{info.balance} QTUM</p>
        <p>= {`<123... USD>`}</p>
        <p>{`<QRC CODE>`}</p>
      </div>
    );
  }
}
