import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: theme.padding.md,
  },
  logoContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: theme.padding.unit,
  },
  logoText: {
    fontSize: 32,
    fontWeight: theme.fontWeight.bold,
    color: theme.palette.primary.main,
    alignSelf: 'center',
  },
  fieldContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  passwordField: {
    marginBottom: theme.padding.md,
  },
  confirmPasswordField: {
    marginBottom: theme.padding.md,
  },
  loginButton: {
    height: theme.button.lg.height,
    borderRadius: theme.button.lg.radius,
  },
});

export default styles;
