const styles = (theme) => ({
  accountContainer: {
    padding: theme.spacing.md,
    background: theme.palette.background.gradient,
    borderRadius: `0 0 ${theme.border.radius} 0`
  },
  selectAcctText: {
    fontSize: theme.font.sm,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.text.light,
  },
  createAccountContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  orText: {
    fontSize: theme.font.md,
    color: theme.palette.text.light,
  },
  createAccountButton: {
    fontSize: theme.font.md,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.text.light,
  },
});

export default styles;
