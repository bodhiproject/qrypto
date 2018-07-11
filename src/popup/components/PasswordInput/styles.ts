import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  passwordTextField: {
    flex: 1,
    padding: theme.padding.sm,
    fontSize: theme.font.sm,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  passwordFieldInput: {
    fontSize: theme.font.sm,
    fontWeight: theme.fontWeight.bold,
  },
});

export default styles;
