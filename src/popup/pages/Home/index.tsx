import * as React from 'react';
import MainAccount from './MainAccount';
// import {
//   withRouter
// } from 'react-router-dom'

class Home extends React.Component<any, {}> {

  goToDetail = () => {
    this.props.history.push('/account-detail')
  }

  public render(){
    return(
      <div>
        <h3>Home</h3>
        <MainAccount />
      </div>
    )
  }
}

export default Home 
//TODO ??why doesn't this work, why do I have to put the click on the component itself
{/* <MainAccount onClick={this.goToDetail}/> */}
// export default withRouter(Home) 
