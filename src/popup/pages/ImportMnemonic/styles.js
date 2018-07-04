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
    width: '100%',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    border: theme.border.root,
    borderRadius: theme.border.radius,
    fontSize: 30,
  },
  mnemonicFieldInput: {
    fontSize: theme.font.lg,
  },
  passwordTextField: {
    width: '100%',
    fontSize: theme.font.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  passwordFieldInput: {
    fontSize: theme.font.sm,
    fontWeight: theme.font.weight.bold,
  },
  button: {
    height: theme.button.lg.height,
    borderRadius: theme.button.lg.radius,
    display: 'flex',
    '&.marginBottom': {
      marginBottom: theme.spacing.sm,
    },
  },
});

export default styles;
