import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { NavBar } from '../../components/NavBar';

@withRouter
@inject('store')
@observer
export default class AccountDetail extends Component<any, {}> {

  public goToSend = () => {
    this.props.history.push('/send');
  }

  public goToReceive = () => {
    this.props.history.push('/receive');
  }

  public componentDidMount() {
    this.props.store.ui.prevLocation = '/';
  }

  public render() {
    const { info } = this.props.store.walletStore;
    return(
      <div>
        <div className="account-detail-header">
          <NavBar hasBackButton={true} title={'Account Detail'} fontStyle={{ color: '#FFFFFF' }} />
          <div className="header-content">
            <address>{info.addrStr}</address>
            <p className="detail-balance"><em>{info.balance}</em> <span>QTUM</span></p>
            <p className="detail-exchange">$1234.56 USD</p>
            <div style={{ textAlign: 'right', marginBottom: '8px' }}>
              <Button 
                variant="contained"
                color="primary"
                onClick={this.goToSend}
                style={{ ...styles.btn, marginRight: '16px' }}
              >
                SEND
              </Button>
              <Button variant="contained" color="primary" onClick={this.goToReceive} style={styles.btn}>
                RECEIVE
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  btn: {
    backgroundColor: '#FFF',
    color: '#5539DF',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
};
