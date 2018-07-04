const styles = (theme) => ({
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
  inputContainer: {
    flex: 1,
  },
  importHeading: {
    fontSize: 20,
    fontWeight: theme.font.weight.bold,
    marginBottom: theme.spacing.sm,
  },
  fieldContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  mnemonicTextField: {
    flex: 1,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  mnemonicFieldInput: {
    fontSize: theme.font.lg,
    lineHeight: '20px',
  },
  passwordField: {
    marginBottom: theme.spacing.xl,
  },
  importButton: {
    height: theme.button.lg.height,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.button.lg.radius,
    display: 'flex',
  },
  cancelButton: {
    minHeight: 0,
    padding: 0,
  },
});

export default styles;
