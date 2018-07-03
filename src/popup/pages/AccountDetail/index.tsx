import React, { Component, Fragment } from 'react';
import { Paper, Tabs, Tab, List, ListItem, Typography, withStyles } from '@material-ui/core/';
import { KeyboardArrowRight } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';

import styles from './styles';
import NavBar from '../../components/NavBar';
import Transaction from '../../../stores/models/Transaction';
import AccountInfo from '../../components/AccountInfo';

@withRouter
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class AccountDetail extends Component<any, {}> {

  public handleTabChange = (_: object, idx: number) => {
    this.props.store.accountDetailStore.activeTabIdx = idx;
  }

  public render() {
    const { classes } = this.props;
    const { accountDetailStore: { activeTabIdx }, transactionStore: { items } } = this.props.store;

    return (
      <Fragment>
        <Paper elevation={2} className={classes.accountDetailHeader}>
          <NavBar hasBackButton hasNetworkSelector isDarkTheme title="Account Detail" />
          <AccountInfo />
        </Paper>
        <Paper elevation={1}>
          <Tabs
            fullWidth
            indicatorColor="primary"
            textColor="primary"
            value={activeTabIdx}
            onChange={this.handleTabChange}
          >
            <Tab label="TRANSACTIONS" className={classes.tab} />
            <Tab label="TOKENS" className={classes.tab} />
          </Tabs>
        </Paper>
        <List className={classes.list}>
          {activeTabIdx === 0 ? (
            <TransactionList transactions={items} classes={classes} />
          ) : (
            <TokenList classes={classes} />
          )}
        </List>
      </Fragment>
    );
  }
}

const shortenTxid = (txid) => {
  return `${txid.substr(0, 6)}...${txid.substr(txid.length - 6, txid.length)}`;
};

const TransactionList = ({ transactions, classes }: any) => {
  console.log(transactions);
  return transactions.map(({ id, pending, confirmations, timestamp, amount }: Transaction) => (
    <ListItem divider key={id} className={classes.txItem}>
      <div className={classes.txInfoContainer}>
        <TxState pending={pending} confirmations={confirmations} classes={classes} />
        <Typography className={classes.txId}>{`txid: ${shortenTxid(id)}`}</Typography>
        <Typography className={classes.txTime}>{timestamp || '01-01-2018 00:00'}</Typography>
      </div>
      <div className={classes.txAmountContainer}>
          <Typography className={classes.txAmount}>{amount}</Typography>
          <div className={classes.txTokenContainer}>
            <Typography className={classes.txToken}>QTUM</Typography>
          </div>
      </div>
      <div>
        <KeyboardArrowRight className={classes.arrowRight} />
      </div>
    </ListItem>
  ));
};

const TxState = ({ pending, confirmations, classes }: any) => {
  if (pending) {
    return <Typography className={cx(classes.txState, 'pending')}>pending</Typography>;
  } else {
    return <Typography className={classes.txState}>{`${confirmations} confirmations`}</Typography>;
  }
};

const TokenList = ({ classes }: any) => {
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
