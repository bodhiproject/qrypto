import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  textField: {
    flex: 1,
    padding: theme.padding.sm,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  textFieldInput: {
    fontSize: theme.font.sm,
    fontWeight: theme.font.weight.bold,
  },
});

export default styles;
