const styles = (theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing.xl,
  },
  logoContainerOuter: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 52,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing.xl,
    alignSelf: 'center',
  },
  logoDesc: {
    fontSize: 20,
    color: theme.palette.primary.main,
  },
  fieldContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  passwordField: {
    marginBottom: theme.spacing.xl,
  },
  confirmPasswordField: {
    marginBottom: theme.spacing.custom(8),
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
