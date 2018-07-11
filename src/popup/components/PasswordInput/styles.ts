import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  passwordTextField: {
    flex: 1,
    fontSize: theme.font.sm,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  passwordFieldInput: {
    padding: theme.padding.md,
    fontSize: theme.font.sm,
    fontWeight: theme.font.weight.bold,
  },
});

export default styles;
