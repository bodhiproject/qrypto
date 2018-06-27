import * as React from 'react';
import { Typography } from '@material-ui/core';
// import styled from 'styled-components'

import BackButton from './BackButton';
import SettingsButton from './SettingsButton';
import NetworkSelector from './NetworkSelector';

export const NavBar = ({ hasBackButton = false, hasSettingsButton = false, hasNetworkSelector = false, title = '', fontStyle = {} }) => (
  <div style={{ margin: 8, flexDirection: 'row', display: 'inline-flex' }}>
    <div style={{ marginRight: 4, cursor: 'pointer' }}>
      {hasBackButton && <BackButton fontStyle={fontStyle} />}
      {hasSettingsButton && <SettingsButton fontStyle={fontStyle} />}
    </div>
    <div style={{ height: 24, display: 'flex', alignItems: 'center' }}>
      <Typography style={{ fontSize: 14, fontWeight: 'bold', ...fontStyle }}>{title}</Typography>
    </div>
    {hasNetworkSelector && <NetworkSelector />}
  </div>
);

// const Col = () => (
//   <div style={{
//     display: 'flex',
//     flexDirection: 'column'
//   }} />
// )

// const Col = styled.div`
//   display: flex;
//   flex-direction: column;
// `

// const Row = styled.div`
//   display: flex;
//   flex-direction: row;
// `

// const TopBar = Row.extend`
//   height: 30px;
// `

// const BottomBar = Row.extend`
//   height: 40px;
// `
