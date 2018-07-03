/* eslint-disable no-unused-vars */
import { createMuiTheme } from '@material-ui/core';

/* Fonts */
const fontMontserrat = 'Montserrat, sans-serif';
const fontSizeSm = 12;
const fontSizeMd = 14;
const fontSizeLg = 16;
const fontSizeXl = 18;

const fontWeightBold = 'bold';

/* Colors */
const primaryColor = '#5539DF';
const primaryColorDark = '#5539DF';
const primaryColorLight = '#8E6BF1';

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
const spacingUnit = 4;
const spacingXs = spacingUnit * 2; // 8
const spacingSm = spacingUnit * 3; // 12
const spacingMd = spacingUnit * 4; // 16
const spacingLg = spacingUnit * 5; // 20
const spacingXl = spacingUnit * 6; // 24

/* Border */
const borderColor = '#cccccc';
const borderSize = 1;
const borderRadius = 8;

/* Button */
const buttonRadius = 16;

/* Icons */
const iconSize = 24;

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
      contrastText: primaryColor,
    },
    background: {
      default: white,
      gradient: `linear-gradient(300.29deg, ${primaryColorLight} -9.7%, ${primaryColor} 85.28%)`,
    },
    text: {
      primary: textColorPrimary,
      secondary: textColorSecondary,
      hint: textColorSecondary,
      light: textColorLight,
    },
    divider: borderColor,
  },

  typography: {
    fontFamily: fontMontserrat,
  //   fontSize: fontSizeTextSm,
  //   fontWeightLight: 300,
  //   fontWeightRegular: 400,
  //   fontWeightMedium: 700,
  //   fontWeightBold: 700, // additional var
  //   // large headline (i.e. title on prediction title)
  //   display1: {
  //     fontSize: px(fontSizeTitleLg),
  //     fontWeight: 400,
  //     lineHeight: lineHeightLg,
  //     marginLeft: '0',
  //     color: textColorPrimary,
  //   },
  //   headline: {
  //     fontSize: px(fontSizeTitleSm),
  //     fontWeight: 400,
  //     lineHeight: lineHeightLg,
  //     marginLeft: '0',
  //     color: textColorPrimary,
  //   },
  //   // large text (i.e. title on prediction title)
  //   title: {
  //     fontSize: px(fontSizeTextMd),
  //     fontWeight: 700,
  //     lineHeight: lineHeightLg,
  //     color: textColorPrimary,
  //   },
  //   body1: {
  //     fontSize: px(fontSizeMeta),
  //     fontWeight: 400,
  //     lineHeight: lineHeightLg,
  //     color: textColorSecondary,
  //   },
  //   body2: {
  //     fontSize: px(fontSizeTextSm),
  //     fontWeight: 400,
  //     lineHeight: lineHeightLg,
  //     color: textColorSecondary,
  //   },
  //   caption: {
  //     fontSize: px(fontSizeMeta),
  //     color: textColorLight,
  //   },
  },

  // Overrides Material components globally
  overrides: {
    MuiButton: {
      root: {
        padding: spacingXs,
        borderRadius: buttonRadius,
        fontWeight: fontWeightBold,
      },
    },
    MuiInput: {
      root: {
        fontSize: fontSizeMd,
      },
    },
  //   MuiSelect: {
  //     select: {
  //       '&:focus': {
  //         backgroundColor: 'transparent',
  //       },
  //     },
  //   },
  //   MuiDialogContentText: {
  //     root: {
  //       wordWrap: 'break-word',
  //     },
  //   },
  //   MuiTabs: {
  //     root: {
  //       zIndex: 999,
  //     },
  //   },
  //   MuiTab: {
  //     root: {
  //       marginTop: px(spacingUnit),
  //       marginBottom: px(spacingUnit),
  //     },
  //     label: {
  //       fontSize: fontSizeTextSm,
  //       textTransform: 'none !important',
  //     },
  //   },
  //   MuiTable: {
  //     root: {
  //       background: white,
  //       border: 'solid 1px '.concat(borderColor),
  //     },
  //   },
  //   MuiTableRow: {
  //     head: {
  //       height: tableHeaderHeight,
  //       background: borderColor,
  //     },
  //   },
  //   MuiTableCell: {
  //     body: {
  //       color: textColorSecondary,
  //       fontSize: 13,
  //     },
  //     head: {
  //       fontWeight: 700,
  //       fontSize: px(fontSizeMeta),
  //     },
  //   },
  //   MuiExpansionPanelSummary: {
  //     expandIcon: {
  //       top: px(spacingSm),
  //       right: 0,
  //     },
  //   },
  },

  /* User-defined variables */
  spacing: {
    unit: px(spacingUnit),
    xs: px(spacingXs),
    sm: px(spacingSm),
    md: px(spacingMd),
    lg: px(spacingLg),
    xl: px(spacingXl),
    custom: (multiplier) => px(spacingUnit * multiplier),
  },

  font: {
    sm: px(fontSizeSm),
    md: px(fontSizeMd),
    lg: px(fontSizeLg),
    xl: px(fontSizeXl),
    weight: {
      bold: fontWeightBold,      
    }
  },

  icon: {
    size: px(iconSize),
  },

  border: {
    root: `${borderColor} solid ${px(borderSize)}`,
    radius: px(borderRadius),
  },
});
