/* eslint-disable no-unused-vars */
import { createMuiTheme } from '@material-ui/core';

/* Fonts */
const fontLato = 'Lato, Helvetica, Arial, sans-serif';

const fontSizeTitleLg = 36;
const fontSizeTitleMd = 32;
const fontSizeTitleSm = 24;
const fontSizeTextLg = 20;
const fontSizeTextMd = 18;
const fontSizeTextSm = 16;
const fontSizeMeta = 14;

const lineHeightLg = '133.33%';
const lineHeightSm = '125%';

const iconSize = 24;

/* Colors */
const primaryColor = '#5246d9';
const primaryColorDark = '#4e44d7';
const primaryColorLight = '#735ef6';

const secondaryColor = '#ffffff';
const secondaryColorLight = '#ffffff';
const secondaryColorDark = '#ffffff';

const white = '#ffffff';
const orange = '#eaa844';

const textColorPrimary = '#333333';
const textColorSecondary = '#747474';
const textColorLight = white;

const backgroundColor = white;

/* Spacing */
const spacingUnit = 8;
const spacingXs = spacingUnit * 2; // 16
const spacingSm = spacingUnit * 3; // 24
const spacingMd = spacingUnit * 5; // 40
const spacingLg = spacingUnit * 7; // 56

/* Border */
const borderColor = '#cccccc';
const borderSize = 1;
const borderRadius = 4;

const px = (value) => value.toString().concat('px');

export default createMuiTheme({
  /* Material Themes */
  palette: {
    primary: {
      light: primaryColorLight,
      main: primaryColor,
      dark: primaryColorDark,
      contrastText: white,
    },
    secondary: {
      light: secondaryColorLight,
      main: secondaryColor,
      dark: secondaryColorDark,
      contrastText: white,
    },
    background: {
      default: white,
    },
    text: {
      primary: textColorPrimary,
      secondary: textColorSecondary,
      hint: textColorLight,
    },
    divider: borderColor,
  },

  typography: {
    fontFamily: fontLato,
    fontSize: fontSizeTextSm,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 700,
    fontWeightBold: 700, // additional var
    // large headline (i.e. title on prediction title)
    display1: {
      fontSize: px(fontSizeTitleLg),
      fontWeight: 400,
      lineHeight: lineHeightLg,
      marginLeft: '0',
      color: textColorDark,
    },
    headline: {
      fontSize: px(fontSizeTitleSm),
      fontWeight: 400,
      lineHeight: lineHeightLg,
      marginLeft: '0',
      color: textColorDark,
    },
    // large text (i.e. title on prediction title)
    title: {
      fontSize: px(fontSizeTextMd),
      fontWeight: 700,
      lineHeight: lineHeightLg,
      color: textColorDark,
    },
    body1: {
      fontSize: px(fontSizeMeta),
      fontWeight: 400,
      lineHeight: lineHeightLg,
      color: textColorSecondary,
    },
    body2: {
      fontSize: px(fontSizeTextSm),
      fontWeight: 400,
      lineHeight: lineHeightLg,
      color: textColorSecondary,
    },
    caption: {
      fontSize: px(fontSizeMeta),
      color: textColorLight,
    },
  },

  // Overrides Material components globally
  overrides: {
    MuiLinearProgress: {
      root: {
        height: px(progressHeight),
        borderRadius: px(progressHeight),
        backgroundColor: borderColor.concat(' !important'),
      },
    },
    MuiSelect: {
      select: {
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: px(spacingLg),
        textTransform: 'none',
      },
      raised: {
        backgroundColor: 'white',
        color: primaryColor,
      },
      sizeLarge: {
        fontSize: px(fontSizeTextLg),
        fontWeight: 700,
        minHeight: px(spacingLg),
      },
    },
    MuiDialogContentText: {
      root: {
        wordWrap: 'break-word',
      },
    },
    MuiTabs: {
      root: {
        zIndex: 999,
      },
    },
    MuiTab: {
      root: {
        marginTop: px(spacingUnit),
        marginBottom: px(spacingUnit),
      },
      label: {
        fontSize: fontSizeTextSm,
        textTransform: 'none !important',
      },
    },
    MuiTable: {
      root: {
        background: white,
        border: 'solid 1px '.concat(borderColor),
      },
    },
    MuiTableRow: {
      head: {
        height: tableHeaderHeight,
        background: borderColor,
      },
    },
    MuiTableCell: {
      body: {
        color: textColorSecondary,
        fontSize: 13,
      },
      head: {
        fontWeight: 700,
        fontSize: px(fontSizeMeta),
      },
    },
    MuiExpansionPanelSummary: {
      expandIcon: {
        top: px(spacingSm),
        right: 0,
      },
    },
  },

  /* User-defined variables */
  spacing: {
    unit: {
      value: spacingUnit,
      px: px(spacingUnit),
    },
    xs: {
      value: spacingXs,
      px: px(spacingXs),
    },
    sm: {
      value: spacingSm,
      px: px(spacingSm),
    },
    md: {
      value: spacingMd,
      px: px(spacingMd),
    },
    lg: {
      value: spacingLg,
      px: px(spacingLg),
    },
  },

  font: {
    titleLg: px(fontSizeTitleLg),
    titleMd: px(fontSizeTitleMd),
    titleSm: px(fontSizeTitleSm),
    textLg: px(fontSizeTextLg),
    textMd: px(fontSizeTextMd),
    textSm: px(fontSizeTextSm),
    meta: px(fontSizeMeta),
  },

  icon: {
    size: px(iconSize),
  },

  border: {
    root: `${borderColor} solid ${px(borderSize)}`
    radius: px(borderRadius),
  },
});
