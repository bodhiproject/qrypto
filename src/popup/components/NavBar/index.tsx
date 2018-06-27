import * as React from 'react';
import { Typography } from '@material-ui/core';
// import styled from 'styled-components'

// import NetworkSelector from './NetworkSelector'
// import SettingsButton from './SettingsButton'
import BackButton from './BackButton';

export const NavBar = ({ hasBackButton = false, title = '' }) => (
  <div style={{ margin: 8, flexDirection: 'row', display: 'inline-flex' }}>
    {hasBackButton && <BackButton />}
    <Typography style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}>{title}</Typography>
    {/* <TopBar>
      <NetworkSelector />
      <SettingsButton />
    </TopBar> */}
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
