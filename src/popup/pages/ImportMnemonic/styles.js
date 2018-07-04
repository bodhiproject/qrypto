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
  passwordTextField: {
    flex: 1,
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
