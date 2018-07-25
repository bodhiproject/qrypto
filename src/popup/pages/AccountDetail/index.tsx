import React, { Component } from 'react';
import { Paper, Tabs, Tab, List, ListItem, Typography, Button, withStyles, WithStyles } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';

import styles from './styles';
import NavBar from '../../components/NavBar';
import Transaction from '../../../models/Transaction';
import AccountInfo from '../../components/AccountInfo';
import AppStore from '../../stores/AppStore';
import QRCToken from '../../../models/QRCToken';

interface IProps {
  classes: Record<string, string>;
  store: AppStore;
}

@inject('store')
@observer
class AccountDetail extends Component<WithStyles & IProps, {}> {

  public handleTabChange = (_: object, idx: number) => {
    this.props.store.accountDetailStore.activeTabIdx = idx;
  }

  public componentDidMount() {
    this.props.store.accountDetailStore.init();
  }

  public componentWillUnmount() {
    this.props.store.accountDetailStore.deinit();
  }

  public render() {
    const { classes, store: { accountDetailStore } } = this.props;
    const { activeTabIdx, transactions, hasMore } = accountDetailStore;

    return (
      <div className={classes.root}>
        <div className={classes.contentContainer}>
          <Paper className={classes.accountDetailPaper} elevation={2}>
            <NavBar hasBackButton isDarkTheme title="Account Detail" />
            <AccountInfo />
          </Paper>
          <Paper className={classes.tabsPaper} elevation={1}>
            <Tabs
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
              <div>
                <TransactionList classes={classes} transactions={transactions} />
                <div className={classes.loadingButtonWrap}>
                  {hasMore && (
                    <Button
                      id="loadingButton"
                      color="primary"
                      size="small"
                      onClick={accountDetailStore.fetchMore}
                      >
                      Load More
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <TokenList {...this.props} />
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
  ),
);

// const TokenListComingSoon = ({ classes }: any) => (
//   <ListItem className={classes.tokenListComingSoonItem}>
//     <Typography className={classes.tokenListComingSoonText}>{'Coming Soon!'}</Typography>
//   </ListItem>
// );

const TokenList = ({ classes, store: { accountDetailStore: { tokens } } }: any) =>
  tokens.map(({ name, abbreviation, balance }: QRCToken) => (
    <ListItem divider key={abbreviation} className={classes.listItem}>
      <div className={classes.tokenInfoContainer}>
        <Typography className={classes.tokenName}>{name}</Typography>
      </div>
      <AmountInfo classes={classes} amount={balance} token={abbreviation} convertedValue={0} />
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

export default withStyles(styles)(AccountDetail);
