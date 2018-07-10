import React, { Component } from 'react';
import { Paper, Tabs, Tab, List, ListItem, Typography, withStyles } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';

import styles from './styles';
import NavBar from '../../components/NavBar';
import Transaction from '../../../models/Transaction';
import AccountInfo from '../../components/AccountInfo';

@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class AccountDetail extends Component<any, {}> {

  public componentDidMount() {
    const { walletStore, accountDetailStore } = this.props.store;
    accountDetailStore.loadFromWallet(walletStore.wallet!, walletStore.info);
  }

  public handleTabChange = (_: object, idx: number) => {
    this.props.store.accountDetailStore.activeTabIdx = idx;
  }

  public render() {
    const { classes } = this.props;
    const { accountDetailStore: { activeTabIdx, items } } = this.props.store;

    const tokens = [
      { name: 'Bodhi', token: 'BOT', amount: 123, url: 'https://coinmarketcap.com/currencies/bodhi/' },
    ];

    return (
      <div className={classes.root}>
        <div className={classes.contentContainer}>
          <Paper className={classes.accountDetailHeader} elevation={2}>
            <NavBar hasBackButton isDarkTheme title="Account Detail" />
            <AccountInfo />
          </Paper>
          <Paper elevation={1}>
            <Tabs
              className={classes.tabs}
              fullWidth
              indicatorColor="primary"
              textColor="primary"
              value={activeTabIdx}
              onChange={this.handleTabChange}
            >
              <Tab label="Transactions" className={classes.tab} />
              <Tab label="Tokens" className={classes.tab} />
            </Tabs>
          </Paper>
          <List className={classes.list}>
            {activeTabIdx === 0 ? (
              <TransactionList classes={classes} transactions={items} />
            ) : (
              <TokenList classes={classes} tokens={tokens} />
            )}
          </List>
        </div>
      </div>
    );
  }
}

const shortenTxid = (txid?: string) => {
  if (!txid) {
    return '';
  }
  return `${txid.substr(0, 6)}...${txid.substr(txid.length - 6, txid.length)}`;
};

const TransactionList = ({ classes, transactions }: any) =>
  transactions.map(({ id, pending, confirmations, timestamp, amount }: Transaction) => (
    <ListItem divider key={id} className={classes.listItem}>
      <div className={classes.txInfoContainer}>
        {pending ? (
          <Typography className={cx(classes.txState, 'pending')}>pending</Typography>
        ) : (
          <Typography className={classes.txState}>{`${confirmations} confirmations`}</Typography>
        )}
        <Typography className={classes.txId}>{`txid: ${shortenTxid(id)}`}</Typography>
        <Typography className={classes.txTime}>{timestamp || '01-01-2018 00:00'}</Typography>
      </div>
      <AmountInfo classes={classes} amount={amount} token="QTUM" />
      <div>
        <KeyboardArrowRight className={classes.arrowRight} />
      </div>
    </ListItem>
  ));

const TokenList = ({ classes, tokens }: any) =>
  tokens.map(({ name, token, amount, url }: any) => (
    <ListItem divider key={token} className={classes.listItem} onClick={() => window.open(url, '_blank')}>
      <div className={classes.tokenInfoContainer}>
        <Typography className={classes.tokenName}>{name}</Typography>
      </div>
      <AmountInfo classes={classes} amount={amount} token={token} convertedValue={1} />
    </ListItem>
  ));

const AmountInfo = ({ classes, amount, token, convertedValue }: any) => (
  <div>
    <div className={classes.tokenContainer}>
      <Typography className={classes.tokenAmount}>{amount}</Typography>
      <div className={classes.tokenTypeContainer}>
        <Typography className={classes.tokenType}>{token}</Typography>
      </div>
    </div>
    {convertedValue && (
      <div className={classes.conversionContainer}>
        <Typography className={classes.tokenType}>{`= ${convertedValue} QTUM`}</Typography>
      </div>
    )}
  </div>
);
