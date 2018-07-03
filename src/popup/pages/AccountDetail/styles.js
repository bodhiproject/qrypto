const styles = (theme) => ({
  accountDetailHeader: {
    background: theme.palette.background.gradient,
    borderRadius: 0,
  },
  tab: {
    flex: 1,
  },
  list: {
    flex: 1,
    padding: `0 ${theme.spacing.md}`,
    overflowY: 'auto'
  },
  txItem: {
    width: '100%',
    padding: `${theme.spacing.md} 0`,
    cursor: 'pointer',
    display: 'inline-flex',
  },
  txInfoContainer: {
    flex: 1,
  },
  txState: {
    fontSize: theme.font.sm,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.unit,
    '&.pending': {
      color: theme.palette.extra.orange,
    },
  },
  txId: {
    fontSize: theme.font.lg,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.text.primary,
  },
  txTime: {
    fontSize: theme.font.md,
    color: theme.palette.text.secondary,
  },
  txAmountContainer: {
    display: 'inline-flex',
    marginRight: theme.spacing.xs,
  },
  txAmount: {
    fontSize: theme.font.lg,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.text.primary,
    marginRight: 2,
  },
  txTokenContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txToken: {
    fontSize: theme.font.xs,
    color: theme.palette.text.secondary,
  },
  arrowRight: {
    fontSize: theme.icon.size,
    color: theme.palette.extra.gray,
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
