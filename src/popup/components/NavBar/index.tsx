import * as React from 'react';
import { Typography } from '@material-ui/core';
// import styled from 'styled-components'

import BackButton from './BackButton';
import SettingsButton from './SettingsButton';
import NetworkSelector from './NetworkSelector';
import theme from '../../../config/theme';

const styles = {
  root: {
    width: '100%',
    margin: theme.spacing.xs,
    flexDirection: 'row',
    display: 'inline-flex',
  },
  leftButtonsContainer: {
    marginRight: theme.spacing.unit,
    cursor: 'pointer',
  },
  locationContainer: {
    height: theme.icon.size,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: theme.font.md,
    fontWeight: 'bold',
  },
};

export const NavBar = ({ hasBackButton = false, hasSettingsButton = false, hasNetworkSelector = false, title = '', fontColor = '' }) => (
  <div style={styles.root}>
    <div style={styles.leftButtonsContainer}>
      {hasBackButton && <BackButton fontColor={fontColor} />}
      {hasSettingsButton && <SettingsButton />}
    </div>
    <div style={styles.locationContainer}>
      <Typography
        style={{
          ...styles.locationText,
          ...(fontColor ? { color: fontColor } : {}),
        }}
      >
        {title}
      </Typography>
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
