const styles = (theme) => ({
  root: {
    padding: theme.spacing.md,
  },
  acctName: {
    fontSize: theme.font.lg,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.text.light,
    marginBottom: theme.spacing.unit,
  },
  address: {
    fontSize: theme.font.sm,
    color: theme.palette.text.light,
    marginBottom: theme.spacing.md,
  },
  amountContainer: {
    width: '100%',
    flexDirection: 'row',
    display: 'inline-flex',
  },
  tokenAmount: {
    fontSize: 32,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.text.light,
    marginRight: theme.spacing.xs,
  },
  token: {
    fontSize: theme.font.sm,
    color: theme.palette.text.light,
    flex: 1,
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  rightArrow: {
    fontSize: 22,
    color: theme.palette.text.light,
    alignSelf: 'center',
  },
  qtumPriceUSD: {
    fontSize: theme.font.sm,
    color: theme.palette.text.light,
    marginBottom: theme.spacing.sm,
  }, 
  actionButtonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: `${theme.spacing.unit} ${theme.spacing.sm}`,
    marginRight: theme.spacing.xs,
    fontSize: theme.font.sm,
  },
});

export default styles;
