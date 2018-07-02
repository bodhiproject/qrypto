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
    this.props.store.accountDetailStore.activeTabIdx = idx;
  }

  public componentDidMount() {
    this.props.store.ui.prevLocation = '/';
  }

  public render() {
    const { classes } = this.props;
    const { accountDetailStore: { activeTabIdx }, transactionStore: { items } } = this.props.store;

    return(
      <Fragment>
        <div className={classes.accountDetailHeader}>
          <NavBar hasBackButton hasNetworkSelector isDarkTheme title="Account Detail" />
          <div className={classes.headerContent}>
            <AccountInfo />
          </div>
        </div>

        <div className={classes.accountDetailTabs}>
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

        <div className={classes.AccountDetailItems}>
          {
            activeTabIdx === 0 ?
              <TransactionList transactions={items} classes={classes} /> :
              <TokenList classes={classes} />
          }
        </div>
      </Fragment>
    );
  }

}

const TransactionList = ({ transactions, classes }) => {
  const items = transactions.map(({ id, pending, confirmations, timestamp, amount }: Transaction) => (
    <li key={id} className={classes.accountDetailTx}>
      <div>
        <TxState pending={pending} confirmations={confirmations} classes={classes} />
      </div>
      <div className={classes.txDetail}>
        <address className={classes.txAddress}>{id}</address>
        <span>
          <em className={classes.txAmount}>{amount}</em>
          <span className={classes.txCurrency}>QTUM</span>
        </span>
        <KeyboardArrowRight className={classes.arrowRight} />
      </div>
      <time className={classes.txTime}>{timestamp}</time>
    </li>
  ));

  return (
    <ul className={classes.accountDetailTxs}>
      {items}
    </ul>
  );
};

const TxState = ({pending, confirmations, classes}) => {
  if (pending) {
    return <span className={classes.txStatePending}>pending</span>;
  } else {
    return <span className={classes.txState}>{confirmations} confirmations</span>;
  }
};

const TokenList = ({ classes }) => {
  return (
    <ul className={classes.tokens}>
      <li className={classes.token}>
        <span className={classes.tokenName}>Token Name</span>
        <div className={classes.tokenDetail}>
          <div>
            <em className={classes.tokenAmount}>5.99</em>
            <span className={classes.txCurrency}>OOXX</span>
          </div>
          <div className={classes.tokenQtumAmount}>
            = 19 QTUM
          </div>
        </div>
      </li>
    </ul>
  );
};
