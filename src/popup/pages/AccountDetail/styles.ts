import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  accountDetailPaper: {
    background: theme.color.gradientPurple,
    borderRadius: 0,
  },
  tabsPaper: {
    borderRadius: 0,
  },
  tab: {
    flex: 1,
  },
  list: {
    flex: 1,
    padding: `0 ${theme.padding.md}`,
    overflowY: 'auto',
  },
  listItem: {
    width: '100%',
    padding: `${theme.padding.md} 0`,
    cursor: 'pointer',
    display: 'inline-flex',
  },
  txInfoContainer: {
    flex: 1,
  },
  txState: {
    'fontSize': theme.font.sm,
    'textTransform': 'uppercase',
    'marginBottom': theme.padding.unit,
    '&.pending': {
      color: theme.color.orange,
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
    color: theme.color.gray,
    marginLeft: theme.padding.xs,
  },
  tokenListComingSoonItem: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: `110px ${theme.padding.lg}`,
  },
  tokenListComingSoonText: {
    fontSize: theme.font.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.palette.text.primary,
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
    marginRight: theme.padding.unit,
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
  loadingButtonWrap: {
    textAlign: 'center',
    padding: '10px',
  },
});

export default styles;
