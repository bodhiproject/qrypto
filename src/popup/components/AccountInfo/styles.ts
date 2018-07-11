import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    padding: theme.padding.md,
  },
  acctName: {
    fontSize: theme.font.lg,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.secondary.main,
    marginBottom: theme.padding.unit,
  },
  address: {
    fontSize: theme.font.sm,
    color: theme.palette.secondary.main,
    marginBottom: theme.padding.md,
  },
  amountContainer: {
    width: '100%',
    flexDirection: 'row',
    display: 'inline-flex',
  },
  tokenAmount: {
    fontSize: 32,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.secondary.main,
    marginRight: theme.padding.xs,
  },
  token: {
    fontSize: theme.font.sm,
    color: theme.palette.secondary.main,
    flex: 1,
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  rightArrow: {
    fontSize: 22,
    color: theme.palette.secondary.main,
    alignSelf: 'center',
  },
  balanceUSD: {
    fontSize: theme.font.sm,
    color: theme.palette.secondary.main,
    marginBottom: theme.padding.sm,
  },
  actionButtonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: `${theme.padding.unit} ${theme.padding.sm}`,
    marginRight: theme.padding.xs,
    fontSize: theme.font.sm,
  },
});

export default styles;
