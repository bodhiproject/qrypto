import React, { Component, SFC } from 'react';
import { Paper, Tabs, Tab, List, ListItem, Typography, Button, withStyles, WithStyles } from '@material-ui/core';
import { KeyboardArrowRight } from '@material-ui/icons';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';
import ReactSVG from 'react-svg';

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

  private messagesEnd?: HTMLElement | null;

  public componentDidMount() {
    const { store: { accountDetailStore } } = this.props;
    accountDetailStore.init();

    if (accountDetailStore.shouldScrollToBottom === true) {
      this.scrollToBottom();
    }
  }

  public componentWillUnmount() {
    this.props.store.accountDetailStore.deinit();
  }

  public scrollToBottom() {
    this.messagesEnd!.scrollIntoView({ behavior: 'smooth' });
    this.props.store.accountDetailStore.shouldScrollToBottom = false;
  }

  public render() {
    const { classes, store: { accountDetailStore } } = this.props;
    const { activeTabIdx } = accountDetailStore;

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
              onChange={(_, value) => accountDetailStore.activeTabIdx = value}
            >
              <Tab label="Transactions" className={classes.tab} />
              <Tab label="Tokens" className={classes.tab} />
            </Tabs>
          </Paper>
          <List className={classes.list}>
            {activeTabIdx === 0 ? <TransactionList {...this.props} /> : <TokenList {...this.props} />}
            <div ref={(el) => { this.messagesEnd = el; }}></div>
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

const TransactionList: SFC<any> = observer(({ classes, store: { accountDetailStore } }: any) => (
  <div>
    {accountDetailStore.transactions.map(({ id, pending, confirmations, timestamp, amount }: Transaction) => (
      <ListItem divider key={id} className={classes.listItem} onClick={() => accountDetailStore.onTransactionClick(id)}>
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
    ))}
    <div className={classes.bottomButtonWrap}>
      {accountDetailStore.hasMore && (
        <Button
          id="loadingButton"
          color="primary"
          size="small"
          onClick={accountDetailStore.fetchMoreTxs}
          >
          Load More
        </Button>
      )}
    </div>
  </div>
));

const TokenList: SFC<any> = observer(({ history, classes,
  store: { accountDetailStore, accountDetailStore: { tokens } } }: any) => (
  <div>
    {tokens.map(({ name, symbol, balance }: QRCToken, index: number) => (
      <ListItem divider key={symbol} className={classes.listItem}
        onClick = {() => accountDetailStore.editTokenMode && accountDetailStore.removeTokenAtIndex(index)}
      >
        {accountDetailStore.editTokenMode &&
          <Button
            className={classes.deleteButton}
            id="removeTokenButton"
          >
            <ReactSVG path="images/Ic_detele.svg" />
          </Button>
        }
        <div className={classes.tokenInfoContainer}>
          <Typography className={classes.tokenName}>{name}</Typography>
        </div>
        <AmountInfo classes={classes} amount={balance} token={symbol} convertedValue={0} />
      </ListItem>
    ))}
    <div className={classes.bottomButtonWrap}>
      <Button
        className={classes.bottomButton}
        id="editTokenButton"
        color="primary"
        size="small"
        onClick={() => accountDetailStore.editTokenMode = !accountDetailStore.editTokenMode }
        >
        {accountDetailStore.editTokenMode ? 'Done' : 'Edit'}
      </Button>
      <Button
        className={classes.bottomButton}
        id="addTokenButton"
        color="primary"
        size="small"
        onClick={() => history.push('/add-token')}
        >
        Add Token
      </Button>
    </div>
  </div>
));

const AmountInfo: SFC<any> = ({ classes, amount, token }: any) => (
  <div>
    <div className={classes.tokenContainer}>
      <Typography className={classes.tokenAmount}>{amount || '...'}</Typography>
      <div className={classes.tokenTypeContainer}>
        <Typography className={classes.tokenType}>{token}</Typography>
      </div>
    </div>
    {/* convertedValue && (
      <div className={classes.conversionContainer}>
        <Typography className={classes.tokenType}>{`= ${convertedValue} QTUM`}</Typography>
      </div>
    ) */}
  </div>
);

export default withStyles(styles)(AccountDetail);
