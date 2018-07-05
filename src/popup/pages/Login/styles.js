const styles = (theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  headerContainer: {
    background: theme.palette.background.gradient,
    borderRadius: 0,
  },
  accountContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.md,
  },
  selectAcctText: {
    fontSize: theme.font.sm,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.text.light,
    marginBottom: theme.spacing.xs,
  },
  accountSelect: {
    flex: 1,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    background: theme.palette.secondary.main,
    borderRadius: theme.border.radius,
  },
  createAccountContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  orText: {
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.font.md,
    color: theme.palette.text.light,
    marginBottom: 3,
  },
  createAccountButton: {
    minHeight: 0,
    padding: `0 ${theme.spacing.unit}`,
    fontSize: theme.font.md,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.text.light,
  },
  permissionContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  permissionsHeader: {
    fontSize: theme.font.sm,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing.md,
  },
});

export default styles;
