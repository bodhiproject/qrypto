const styles = (theme) => ({
  contentContainer: {
    margin: theme.spacing.md,
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
      marginBottom: 200,
    }
  },
});

export default styles;
