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
  listItem: {
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
    color: theme.palette.text.primary,
  },
  txTime: {
    fontSize: theme.font.md,
    color: theme.palette.text.secondary,
  },
  arrowRight: {
    fontSize: theme.icon.size,
    color: theme.palette.extra.gray,
    marginLeft: theme.spacing.xs,
  },
  tokenInfoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenName: {
    flex: 1,
    fontSize: theme.font.lg,
    color: theme.palette.text.primary,
  },
  tokenContainer: {
    display: 'inline-flex',
  },
  tokenAmount: {
    fontSize: theme.font.lg,
    color: theme.palette.text.primary,
    marginRight: theme.spacing.unit,
  },
  tokenTypeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenType: {
    fontSize: theme.font.xs,
    color: theme.palette.text.secondary,
  },
});

export default styles;
