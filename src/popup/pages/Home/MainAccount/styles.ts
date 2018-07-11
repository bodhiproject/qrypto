import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  card: {
    cursor: 'pointer',
    borderRadius: theme.border.radius,
  },
  cardContent: {
    padding: 0,
    background: theme.color.gradientPurple,
  },
});

export default styles;
