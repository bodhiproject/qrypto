import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: theme.padding.md,
  },
  fieldsContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  fieldHeading: {
    marginBottom: theme.padding.unit,
    fontSize: theme.font.sm,
    fontWeight: 'bold',
  },
  fieldContainer: {
    marginBottom: theme.padding.md,
  },
  fieldContentContainer: {
    padding: theme.padding.sm,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  select: {
    width: '100%',
  },
  selectTypography: {
    fontSize: theme.font.md,
    fontWeight: 'bold',
  },
});

export default styles;
