import * as React from 'react';
// import styled from 'styled-components'
// import NetworkSelector from './NetworkSelector'
// import SettingsButton from './SettingsButton'
import BackButton from './BackButton';

export const NavBar = ({ hasBackButton = false, title = '' }) => (
  <div>
    {/* <TopBar>
      <NetworkSelector />
      <SettingsButton />
    </TopBar> */}
    {hasBackButton && (
      <div>
        <BackButton />
        {title}
      </div>
    )}
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
