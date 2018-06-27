import React, { Component } from 'react';

import { NavBar } from '../../components/NavBar';
import MainAccount from './MainAccount';

class Home extends Component<any, {}> {

  public goToDetail = () => {
    this.props.history.push('/account-detail');
  }

  public render() {
    return (
      <div>
        <NavBar hasSettingsButton={true} title='Home' />
        <div style={{ margin: 16 }}>
          <MainAccount />
        </div>
      </div>
    );
  }
}

export default Home;
// TODO ??why doesn't this work, why do I have to put the click on the component itself
{/* <MainAccount onClick={this.goToDetail}/> */}
// export default withRouter(Home)
