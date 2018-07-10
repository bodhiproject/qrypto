/* eslint-disable no-unused-vars */
import { createMuiTheme } from '@material-ui/core';

/* Fonts */
const fontMontserrat = 'Montserrat, sans-serif';
const fontSizeXs = 10;
const fontSizeSm = 12;
const fontSizeMd = 14;
const fontSizeLg = 16;
const fontSizeXl = 18;

const fontWeightBold = 'bold';

const lineHeightXs = 12;
const lineHeightSm = 16;
const lineHeightMd = 20;
const lineHeightLg = 24;
const lineHeightXl = 32;

/* Colors */
const primaryColor = '#5539DF';
const primaryColorDark = '#5539DF';
const primaryColorLight = '#8E6BF1';

const secondaryColor = '#ffffff';
const secondaryColorLight = '#ffffff';
const secondaryColorDark = '#ffffff';

const white = '#ffffff';
const gray = '#747474';
const orange = '#F5A623';
const red = '#E50000';

const textColorPrimary = '#333333';
const textColorSecondary = gray;
const textColorLight = white;
const textColorError = red;

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
const buttonRadiusSm = 16;
const buttonRadiusLg = 24;

const buttonHeightSm = 32;
const buttonHeightLg = 48;

/* Icons */
const iconSize = 24;

const px = (value) => value.toString().concat('px');

export default createMuiTheme({
  /* Material color overrides */
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
      error: textColorError,
    },
    extra: {
      gray,
      orange,
      red,
    },
    divider: borderColor,
  },

  /* Material font overrides */
  typography: {
    fontFamily: fontMontserrat,
    fontSize: fontSizeMd,
    lintHeight: lineHeightMd,
  },

  /* Material component overrides */
  overrides: {
    MuiButton: {
      root: {
        padding: spacingXs,
        fontWeight: fontWeightBold,
        borderRadius: buttonRadiusSm,
      },
    },
    MuiInput: {
      root: {
        fontFamily: fontMontserrat,
        fontSize: fontSizeMd,
      },
    },
    MuiTab: {
      root: {
        padding: `${spacingMd} 0`,
      },
      label: {
        fontFamily: fontMontserrat,
        fontSize: fontSizeSm,
        fontWeight: fontWeightBold,
      },
    },
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
    xs: px(fontSizeXs),
    sm: px(fontSizeSm),
    md: px(fontSizeMd),
    lg: px(fontSizeLg),
    xl: px(fontSizeXl),
    weight: {
      bold: fontWeightBold,      
    },
    lineHeight: {
      xs: px(lineHeightXs),
      sm: px(lineHeightSm),
      md: px(lineHeightMd),
      lg: px(lineHeightLg),
      xl: px(lineHeightXl),
    },
  },

  icon: {
    size: px(iconSize),
  },

  border: {
    root: `${borderColor} solid ${px(borderSize)}`,
    radius: px(borderRadius),
  },

  button: {
    sm: {
      height: buttonHeightSm,
      radius: buttonRadiusSm,
    },
    lg: {
      height: buttonHeightLg,
      radius: buttonRadiusLg,
    },
  },
});
