import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  menuButton: {
    height: 24,
    minWidth: 0,
    minHeight: 0,
    padding: `0 ${theme.padding.sm}`,
    color: theme.palette.text.primary,
    textTransform: 'none',
  },
});

export default styles;
