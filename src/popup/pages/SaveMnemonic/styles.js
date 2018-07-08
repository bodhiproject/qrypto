const styles = (theme) =>({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing.md,
  },
  warningText: {
    fontSize: theme.font.md,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing.md,
  },
  mnemonicText: {
    flex: 1,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
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
      marginBottom: theme.spacing.md,
    },
  },
});

export default styles;
