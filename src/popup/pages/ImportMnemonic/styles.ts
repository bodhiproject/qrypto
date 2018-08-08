import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
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
  headerText: {
    fontSize: 20,
    fontWeight: theme.fontWeight.bold,
    color: theme.palette.text.primary,
    marginBottom: theme.padding.sm,
  },
  inputContainer: {
    flex: 1,
  },
  importHeading: {
    fontSize: 20,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.padding.sm,
  },
  fieldContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  mnemonicTextField: {
    flex: 1,
    marginBottom: theme.padding.md,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  mnemonicFieldInput: {
    padding: theme.padding.sm,
    fontSize: theme.font.md,
    lineHeight: '20px',
  },
  importButton: {
    height: theme.button.lg.height,
    marginBottom: theme.padding.sm,
    borderRadius: theme.button.lg.radius,
    display: 'flex',
  },
  cancelButton: {
    minHeight: 0,
    padding: 0,
  },
});

export default styles;
