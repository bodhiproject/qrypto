import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  card: {
    cursor: 'pointer',
    borderRadius: theme.border.radius,
  },
  cardContent: {
    background: theme.color.gradientPurple,
  },
});

export default styles;
