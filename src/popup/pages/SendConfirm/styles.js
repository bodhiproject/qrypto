const styles = (theme) => ({
  sendConfirmRoot: {
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
  fieldLabel: {
    color: theme.palette.text.primary,
    fontSize: theme.font.sm,
    fontWeight: theme.font.weight.bold,
  },
  fieldValue: {
    color: theme.palette.text.primary,
    fontSize: theme.font.sm,
  },
  fieldUnit: {
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit,
  },
  fieldContainer: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between', 
    borderBottom: theme.border.root,
    alignItems: 'center', 
    height: 45,
    '&.last': {
      borderBottom: 'none',
    }
  },
  inputContainer: {
    flex: 1,
  },
});

export default styles;
