const styles = (theme) => ({
  root:{
    height: '100%',
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',  
  }, 
  text:{
    fontSize: theme.font.sm,
    color: theme.palette.text.primary,
    marginBottom: '6px', 
  }, 
  anim9: {
    width: '160px', 
    height: '6px', 
    background: 'linear-gradient( to right, #5539DF, #5539DF 30%, #999 10%)',
    animation: 'anim9 1s linear infinite', 
  },
  '@keyframes anim9': {
    to: { backgroundPosition: '160px'}
  }, 
});

export default styles;
