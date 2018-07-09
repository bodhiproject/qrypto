const styles = (theme) => ({
  root:{
    height: '100%',
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',  
    background: 'white',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999999,
    transition: 'opacity 1s;',
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
