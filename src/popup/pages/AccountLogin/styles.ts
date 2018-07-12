import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  headerContainer: {
    background: theme.color.gradientPurple,
    borderRadius: 0,
  },
  accountContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.padding.md,
  },
  selectAcctText: {
    fontSize: theme.font.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.palette.secondary.main,
    marginBottom: theme.padding.xs,
  },
  accountSelect: {
    flex: 1,
    padding: theme.padding.sm,
    marginBottom: theme.padding.sm,
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
    color: theme.palette.secondary.main,
    marginBottom: 3,
  },
  createAccountButton: {
    minHeight: 0,
    padding: `0 ${theme.padding.unit}`,
    fontSize: theme.font.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.palette.secondary.main,
  },
  permissionContainer: {
    flex: 1,
    padding: theme.padding.md,
  },
  permissionsHeader: {
    fontSize: theme.font.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.palette.text.primary,
    marginBottom: theme.padding.md,
  },
  loginContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.padding.md,
  },
  passwordField: {
    flex: 1,
    marginBottom: theme.padding.md,
  },
  loginButton: {
    height: theme.button.lg.height,
    borderRadius: theme.button.lg.radius,
  },
});

export default styles;
