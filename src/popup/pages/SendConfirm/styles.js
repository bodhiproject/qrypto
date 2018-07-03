const styles = (theme) => ({
  contentContainer: {
    margin: theme.spacing.md,
  },
  fieldLabel: {
    color: theme.palette.text.primary,
    fontSize: theme.font.sm,
    fontWeight: 'bold',
  },
  fieldValue: {
    color: theme.palette.text.primary,
    fontSize: theme.font.sm,
  },
  fieldUnit: {
    color: 'gray',
    marginLeft: 4,
  },
  fieldContainer: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between', 
    borderBottom: '1px #E3E3E3 solid',
    alignItems: 'center', 
    height: 45,
  },
  fieldContainerLast: {
    borderBottom: 'none',    
    marginBottom: 200
  }
});

export default styles;
