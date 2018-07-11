const styles = (theme) => ({
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
    fontWeight: 'bold'
  },
  fieldContainer: {
    marginBottom: theme.padding.lg,
  },
  fieldContentContainer: {
    padding: theme.padding.sm,
    border: theme.border.root,
    borderRadius: theme.border.radius,
  },
  fromSelect: {
    width: '100%',
  },
  fromAddress: {
    fontSize: theme.font.md,
    fontWeight: 'bold',
  },
  fromBalance: {
    fontSize: theme.font.md,
    color: '#333333',
  },
  tokenSelect: {
    width: '100%',
  },
  tokenText: {
    fontSize: theme.font.md,
    fontWeight: 'bold',
  },
  amountContainer: {
    // marginBottom: theme.padding.custom(26),
  },
  amountHeadingContainer: {
    width: '100%',
    flexDirection: 'row',
    display: 'inline-flex',
  },
  amountHeadingTextContainer: {
    flex: 1,
  },
  maxButton: {
    minWidth: 0,
    minHeight: 0,
    padding: '0 4px',
  },
  amountTokenAdornment: {
    fontSize: theme.font.md,
    fontWeight: 'bold',
    marginLeft: theme.padding.sm,
    display: 'flex',
    alignItems: 'center',
  },
  sendButton: {
    height: theme.button.lg.height,
    borderRadius: theme.button.lg.radius,
  }
});

export default styles;
