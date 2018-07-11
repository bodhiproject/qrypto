import { StyleRulesCallback, Theme } from '@material-ui/core';

const styles: StyleRulesCallback = (theme: Theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    margin: theme.padding.md,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  inputContainer: {
    flex: 1,
  },
  addressFieldsContainer: {
    marginBottom: theme.padding.custom(8),
  },
  fieldContainer: {
    width: '100%',
    borderBottom: theme.border.root,
    '&.row': {
      display: 'flex',
      flexDirection: 'row',
    },
    '&.marginSmall': {
      marginBottom: theme.padding.md,
    },
    '&.marginBig': {
      marginBottom: theme.padding.custom(8),
    },
  },
  labelContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  fieldLabel: {
    color: theme.palette.text.primary,
    fontSize: theme.font.sm,
    fontWeight: theme.font.weight.bold,
    '&.address': {
      lineHeight: theme.font.lineHeight.sm,
      marginBottom: theme.padding.md,
    },
    '&.cost': {
      lineHeight: theme.font.lineHeight.md,
    },
  },
  addressValue: {
    fontSize: theme.font.sm,
    color: theme.palette.text.primary,
    lineHeight: theme.font.lineHeight.lg,
  },
  amountContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  fieldValue: {
    fontSize: theme.font.lg,
    color: theme.palette.text.primary,
    lineHeight: theme.font.lineHeight.lg,
  },
  unitContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  fieldUnit: {
    fontSize: theme.font.sm,
    textTransform: 'uppercase',
    color: theme.palette.text.secondary,
    marginLeft: theme.padding.unit,
  },
  errorMessage: {
    fontSize: theme.font.sm,
    fontWeight: theme.font.weight.bold,
    color: theme.color.red,
    alignSelf: 'center',
    marginBottom: theme.padding.unit,
  },
  sendButton: {
    height: theme.button.lg.height,
    borderRadius: theme.button.lg.radius,
  },
});

export default styles;
