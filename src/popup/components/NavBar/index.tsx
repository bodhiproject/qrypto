import * as React from 'react';
import { Typography } from '@material-ui/core';
// import styled from 'styled-components'

import BackButton from './BackButton';
import SettingsButton from './SettingsButton';
import NetworkSelector from './NetworkSelector';

const styles = {
  root: {
    width: '100%',
    margin: 8,
    flexDirection: 'row',
    display: 'inline-flex',
  },
  leftButtonsContainer: {
    marginRight: 4,
    cursor: 'pointer',
  },
  locationContainer: {
    height: 24,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
};

export const NavBar = ({ hasBackButton = false, hasSettingsButton = false, hasNetworkSelector = false, title = '' }) => (
  <div style={styles.root}>
    <div style={styles.leftButtonsContainer}>
      {hasBackButton && <BackButton />}
      {hasSettingsButton && <SettingsButton />}
    </div>
    <div style={styles.locationContainer}>
      <Typography style={styles.locationText}>{title}</Typography>
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
