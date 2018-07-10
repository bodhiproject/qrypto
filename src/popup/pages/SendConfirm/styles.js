const styles = (theme) => ({
  root: {
    height: '100%',
    display: 'flex', 
    flexDirection: 'column'
  },
  contentContainer: {
    margin: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  inputContainer: {
    flex: 1,
  },
  addressFieldsContainer: {
    marginBottom: theme.spacing.custom(8),
  },
  fieldContainer: {
    width: '100%',
    borderBottom: theme.border.root,
    '&.row': {
      display: 'flex',
      flexDirection: 'row',
    },
    '&.marginSmall': {
      marginBottom: theme.spacing.md,
    },
    '&.marginBig': {
      marginBottom: theme.spacing.custom(8),
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
      marginBottom: theme.spacing.md,
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
    marginLeft: theme.spacing.unit,
  },
  errorMessage: {
    fontSize: theme.font.sm,
    fontWeight: theme.font.weight.bold,
    color: theme.palette.text.error,
    alignSelf: 'center',
    marginBottom: theme.spacing.unit,
  },
  sendButton: {
    height: theme.button.lg.height,
    borderRadius: theme.button.lg.radius,
  },
});

export default styles;
