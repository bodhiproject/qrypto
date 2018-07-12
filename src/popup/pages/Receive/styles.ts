import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: theme.padding.md,
  },
  accountName: {
    color: theme.palette.text.primary,
    fontSize: theme.font.lg,
    fontWeight: 'bold',
    marginBottom: theme.padding.unit,
  },
  accountAddress: {
    color: theme.palette.text.primary,
    fontSize: theme.font.sm,
    marginBottom: theme.padding.md,
  },
  amountContainer: {
    width: '100%',
    flexDirection: 'row',
    display: 'inline-flex',
  },
  tokenAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.palette.text.primary,
    marginRight: theme.padding.xs,
  },
  token: {
    fontSize: theme.font.sm,
    color: theme.palette.text.primary,
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  currencyValue: {
    fontSize: theme.font.sm,
    color: theme.palette.text.primary,
    marginBottom: 32,
  },
  qrCodeContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
});

export default styles;
