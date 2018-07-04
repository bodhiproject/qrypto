const styles = (theme) => ({
  root: {
    width: '100%',
    height: '100%',
    margin: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column',
  },
  inputContainer: {
    flex: 1,
  },
  importHeading: {
    fontSize: 20,
    fontWeight: theme.font.weight.bold,
    marginBottom: theme.spacing.sm,
  },
  mnemonicTextField: {
    fontSize: theme.font.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  passwordTextField: {
    fontSize: theme.font.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  importButton: {
    display: 'flex',
    marginBottom: theme.spacing.sm,
  },
  cancelButton: {
    display: 'flex',
  },
});

export default styles;
