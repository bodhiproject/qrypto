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
    overflowY: 'auto',
  },
  fieldHeading: {
    marginBottom: theme.padding.halfUnit,
    fontSize: theme.font.sm,
    fontWeight: 'bold',
  },
  fieldContainer: {
    marginBottom: theme.padding.sm,
  },
  fieldContentContainer: {
    padding: theme.padding.xs,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  errorText: {
    fontSize: theme.font.xs,
    color: theme.color.red,
    marginTop: theme.padding.unit,
  },
  fieldTextOrInput: {
    fontSize: theme.font.sm,
  },
  fieldInput: {
    padding: 0,
  },
  selectOrTextField: {
    width: '100%',
    height: 17,
    fontSize: theme.font.sm,
  },
  buttonFieldHeadingContainer: {
    width: '100%',
    flexDirection: 'row',
    display: 'inline-flex',
    alignItems: 'center',
  },
  buttonFieldHeadingTextContainer: {
    flex: 1,
  },
  fieldButtonText: {
    fontSize: theme.font.sm,
  },
  fieldButton: {
    minWidth: 0,
    minHeight: 0,
    padding: '0 4px',
    fontSize: 11,
  },
  fieldTextAdornment: {
    fontSize: theme.font.sm,
    fontWeight: 'bold',
    marginLeft: theme.padding.sm,
    display: 'flex',
    alignItems: 'center',
  },
  sendButton: {
    height: theme.button.lg.height,
    borderRadius: theme.button.lg.radius,
  },
});

export default styles;
