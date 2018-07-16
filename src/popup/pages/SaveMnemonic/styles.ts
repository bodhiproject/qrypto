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
    margin: theme.padding.md,
  },
  topContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  walletCreatedHeader: {
    fontSize: 20,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.padding.sm,
  },
  mnemonicText: {
    padding: theme.padding.md,
    marginBottom: theme.padding.md,
    fontSize: theme.font.lg,
    fontFamily: 'Roboto Mono, monospace',
    color: theme.palette.text.primary,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  warningText: {
    fontSize: theme.font.sm,
    lineHeight: theme.lineHeight.md,
    color: theme.palette.text.secondary,
  },
  actionButton: {
    height: theme.button.lg.height,
    borderRadius: theme.button.lg.radius,
    '&.marginBottom': {
      marginBottom: theme.padding.sm,
    },
  },
});

export default styles;
