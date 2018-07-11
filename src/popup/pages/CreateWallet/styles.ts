import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: theme.padding.xl,
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
    marginBottom: theme.padding.lg,
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
  walletNameField: {
    marginBottom: theme.padding.md,
  },
  passwordField: {
    marginBottom: theme.padding.md,
  },
  confirmPasswordField: {
    marginBottom: theme.padding.custom(8),
  },
  loginButton: {
    height: theme.button.lg.height,
    marginBottom: theme.padding.sm,
    borderRadius: theme.button.lg.radius,
    display: 'flex',
  },
  importButton: {
    minHeight: 0,
    padding: 0,
  },
});

export default styles;
