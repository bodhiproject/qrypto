import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { NavBar } from '../../components/NavBar';
import Transaction from '../../../stores/Transaction';

@withRouter
@inject('store')
@observer
export default class AccountDetail extends Component<any, {}> {

  public state = {
    activeTabIdx: 0,
  };

  public goToSend = () => {
    this.props.history.push('/send');
  }

  public goToReceive = () => {
    this.props.history.push('/receive');
  }

  public handleTabChange = (event, idx) => {
    this.setState({ activeTabIdx: idx });
  }

  public componentDidMount() {
    this.props.store.ui.prevLocation = '/';
  }

  public render() {
    const { info } = this.props.store.walletStore;
    const { activeTabIdx } = this.state;

    return(
      <>
        <div className="account-detail-header">
          <NavBar hasBackButton hasNetworkSelector title="Account Detail" fontColor="#FFFFFF" />
          <div className="header-content">
            <address>{info.addrStr}</address>
            <p className="detail-balance"><em>{info.balance}</em> <span>QTUM</span></p>
            <p className="detail-exchange">$1234.56 USD</p>
            <div className="detail-header-btn-group">
              <Button 
                color="secondary"
                variant="contained"
                size="small"
                onClick={this.goToSend}
                className="detail-header-btn send-btn"
              >
                SEND
              </Button>
              <Button
                color="secondary"
                variant="contained"
                size="small"
                onClick={this.goToReceive}
                className="detail-header-btn"
              >
                RECEIVE
              </Button>
            </div>
          </div>
        </div>

        <div className="account-detail-tabs">
          <Tabs
            indicatorColor="primary"
            textColor="primary"
            fullWidth
            value={activeTabIdx}
            onChange={this.handleTabChange}
          >
            <Tab label="TRANSACTIONS" />
            <Tab label="TOKENS" />
          </Tabs>
        </div>

        <div className="account-detail-items">
          {this.renderTabContent()}
        </div>
      </>
    );
  }

  public renderTabContent() {
    const { activeTabIdx } = this.state;
    if (activeTabIdx === 0) {
      return (
        <ul className="account-detail-txs">
          {this.renderTransactions()}
        </ul>
      );
    } else {
      return (
        <div>Item Two</div>
      );
    }
  }

  public renderTransactions() {
    const { walletStore: { transactions: { items } } } = this.props.store;

    return items.map(({ id }: Transaction) => (
      <li key={id}>
        <p>{id}</p>
      </li>
    ));
  }

}
