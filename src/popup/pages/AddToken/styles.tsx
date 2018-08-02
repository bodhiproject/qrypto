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
    marginBottom: theme.padding.custom(8),
  },
  detailContainer: {
    width: '100%',
    borderBottom: theme.border.root,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.padding.custom(8),
  },
  fieldContentContainer: {
    padding: theme.padding.sm,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  errorText: {
    fontSize: theme.font.xs,
    color: theme.color.red,
    marginTop: theme.padding.unit,
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  detailLabel: {
    color: theme.palette.text.primary,
    fontSize: theme.font.sm,
    fontWeight: theme.fontWeight.bold,
    lineHeight: theme.lineHeight.md,
  },
  valueContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  detailValue: {
    fontSize: theme.font.lg,
    color: theme.palette.text.primary,
    lineHeight: theme.lineHeight.lg,
  },
  addButton: {
    height: theme.button.lg.height,
    borderRadius: theme.button.lg.radius,
  },
});

export default styles;
