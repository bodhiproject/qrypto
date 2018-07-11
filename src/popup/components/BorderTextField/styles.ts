import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  textField: {
    flex: 1,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  textFieldInput: {
    padding: theme.padding.md,
    fontSize: theme.font.sm,
    fontWeight: theme.font.weight.bold,
  },
});

export default styles;
