import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
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
});

export default styles;
