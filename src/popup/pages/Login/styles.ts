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
    width: 112,
    height: 112,
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
  masterPwNote: {
    fontSize: theme.font.sm,
    color: theme.palette.text.secondary,
    marginBottom: theme.padding.md,
  },
  loginButton: {
    height: theme.button.lg.height,
    borderRadius: theme.button.lg.radius,
  },
});

export default styles;
