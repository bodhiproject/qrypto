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
  warningText: {
    fontSize: theme.font.md,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.text.primary,
    marginBottom: theme.padding.md,
  },
  mnemonicText: {
    flex: 1,
    padding: theme.padding.md,
    marginBottom: theme.padding.md,
    fontSize: theme.font.xl,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.primary.main,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  actionButton: {
    height: theme.button.lg.height,
    borderRadius: theme.button.lg.radius,
    '&.marginBottom': {
      marginBottom: theme.padding.md,
    },
  },
});

export default styles;
