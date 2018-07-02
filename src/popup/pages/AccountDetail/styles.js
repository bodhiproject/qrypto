const styles = (theme) => ({
  accountDetailHeader: {
    color: 'white',
    boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
    background: theme.palette.background.gradient,
  },
  headerContent: {
    padding: '16px',
  },
  accountDetailTabs: {
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
  },
  AccountDetailItems: {
    flex: 1,
    padding: '0 16px',
    overflowY: 'auto'
  },
  accountDetailTxs: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  accountDetailTx: {
    padding: '16px 0',
    cursor: 'pointer',
    borderBottom: '1px #E3E3E3 solid',
  },
  txState: {
    lineHeight: '16px',
    fontSize: '12px',
    textTransform: 'uppercase',
  },
  txStatePending: {
    lineHeight: '16px',
    fontSize: '12px',
    textTransform: 'uppercase',
    color: '#F5A623',
  },
  txDetail: {
    display: 'flex',
    alignItems: 'center',
  },
  txAddress: {
    display: 'block',
    wordWrap: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    flex: 1,
    lineHeight: '24px',
    fontSize: '16px',
    fontWeight: 'bold',
    fontStyle: 'normal',
    marginRight: '45px',
    color: 'rgba(0, 0, 0, 0.8)',
  },
  txAmount: {
    lineHeight: '24px',
    fontSize: '16px',
    fontWeight: 'bold',
    fontStyle: 'normal',
    marginRight: 5,
    color: 'rgba(0, 0, 0, 0.87)',
  },
  txCurrency: {
    lineHeight: '24px',
    fontSize: '10px',
    color: '#A0A0A0',
  },
  arrowRight: {
    fontSize: 22,
    color: '#747474',
  },
  txTime: {
    lineHeight: '20px',
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.543846)',
  },
  tokens: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  token: {
    padding: '16px 0',
    borderBottom: '1px #E3E3E3 solid',
    display: 'flex',
    alignItems: 'center',

  },
  tokenName: {
    flex: 1,
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '24px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.87)',

  },
  tokenDetail: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tokenAmount: {
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '24px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, 0.87)',
    marginRight: '5px',
  },
  tokenQtumAmount: {
    lineHeight: '16px',
    fontSize: '10px',
    color: '#A0A0A0',
  }
});

export default styles;
