import React, { Component, Fragment } from 'react';
import { Tabs, Tab, withStyles } from '@material-ui/core/';
import { KeyboardArrowRight } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import NavBar from '../../components/NavBar';
import Transaction from '../../../stores/models/Transaction';
import styles from './styles';
import AccountInfo from '../../components/AccountInfo';

@withRouter
@inject('store')
@withStyles(styles, { withTheme: true })
@observer
export default class AccountDetail extends Component<any, {}> {

  public handleTabChange = (_, idx) => {
    this.props.state.accountDetailStore.activeTabIdx = idx;
  }

  public componentDidMount() {
    this.props.store.ui.prevLocation = '/';
  }

  public render() {
    const { classes } = this.props;
    const { accountDetailStore: { activeTabIdx } } = this.props.store;

    return(
      <Fragment>
        <div className={classes.accountDetailHeader}>
          <NavBar hasBackButton hasNetworkSelector isDarkTheme title="Account Detail" />
          <div className={classes.headerContent}>
            <AccountInfo />
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
      </Fragment>
    );
  }

  public renderTabContent() {
    const { activeTabIdx } = this.props.store.accountDetailStore;

    if (activeTabIdx === 0) {
      return (
        <ul className="account-detail-txs">
          {this.renderTransactions()}
        </ul>
      );
    } else {
      return (
        <ul className="account-detail-tokens">
          {this.renderTokens()}
        </ul>
      );
    }
  }

  public renderTransactions() {
    const { transactionStore: { items } } = this.props.store;

    return items.map(({ id, pending, confirmations, timestamp, amount }: Transaction) => (
      <li key={id}>
        <p>{this.renderTxState(pending, confirmations)}</p>
        <div className="tx-detail">
          <address>{id}</address>
          <span>
            <em>{amount}</em> <span className="tx-currency">QTUM</span>
          </span>
          <KeyboardArrowRight className="arrow-right" />
        </div>
        <p className="tx-time">{this.renderTxTime(timestamp)}</p>
      </li>
    ));
  }

  public renderTxState(pending: boolean, confirmations: number) {
    if (pending) {
      return (
        <span className="tx-state tx-state-pending">pending</span>
      );
    } else {
      return (
        <span className="tx-state">{confirmations} confirmations</span>
      );
    }
  }

  public renderTxTime(at?: string) {
    return at ? at : 'Unknow timestamp';
  }

  public renderTokens() {
    return (
      <>
        <li>
          <span className="token-name">Token Name</span>
          <div className="token-detail">
            <div className="token-amount">
              <em>5.99</em>
              <span className="tx-currency">OOXX</span>
            </div>
            <div className="token-qtum-amount">
              = 19 QTUM
            </div>
          </div>
        </li>

        <li>
          <span className="token-name">Token Name</span>
          <div className="token-detail">
            <div className="token-amount">
              <em>5.99</em>
              <span className="token-currency">OOXX</span>
            </div>
            <div className="token-qtum-amount">
              = 19 QTUM
            </div>
          </div>
        </li>
      </>
    );
  }

}
