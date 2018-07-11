/* eslint-disable no-unused-vars */
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const px = (value: number) => value.toString().concat('px');

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
const colorWhite = '#FFFFFF';
const colorGray = '#747474';
const colorOrange = '#F5A623';
const colorRed = '#E50000';

const primaryColor = '#5539DF';
const primaryColorDark = '#5539DF';
const primaryColorLight = '#8E6BF1';

const secondaryColor = colorWhite;
const secondaryColorLight = colorWhite;
const secondaryColorDark = colorWhite;

const textColorPrimary = '#333333';
const textColorSecondary = colorGray;

const gradientPurple = `linear-gradient(300.29deg, ${primaryColorLight} -9.7%, ${primaryColor} 85.28%)`;

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

declare module '@material-ui/core/styles/createMuiTheme' {
  // tslint:disable-next-line:interface-name
  interface Theme {
    color: {
      gray: string;
      orange: string;
      red: string;
      gradientPurple: string;
    };
    padding: {
      unit: number;
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      custom(multiplier: number): number;
    };
    font: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      weight: {
        bold: string;
      };
      lineHeight: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
    };
    border: {
      root: string;
      radius: number;
    };
    icon: {
      size: number;
    };
    button: {
      sm: {
        height: number;
        radius: number;
      };
      lg: {
        height: number;
        radius: number;
      };
    };
  }
  // allow configuration using `createMuiTheme`
  // tslint:disable-next-line:interface-name
  interface ThemeOptions {
    color?: {
      gray?: string;
      orange?: string;
      red?: string;
      gradientPurple?: string;
    };
    padding?: {
      unit?: number;
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      custom?(multiplier: number): number;
    };
    font?: {
      xs?: number;
      sm?: number;
      md?: number;
      lg?: number;
      xl?: number;
      weight?: {
        bold: string;
      };
      lineHeight?: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
    };
    border?: {
      root?: string;
      radius?: number;
    };
    icon?: {
      size?: number;
    };
    button?: {
      sm?: {
        height?: number;
        radius?: number;
      };
      lg?: {
        height?: number;
        radius?: number;
      };
    };
  }
}

export default createMuiTheme({
  /* Material color overrides */
  palette: {
    primary: {
      light: primaryColorLight,
      main: primaryColor,
      dark: primaryColorDark,
      contrastText: colorWhite,
    },
    secondary: {
      light: secondaryColorLight,
      main: secondaryColor,
      dark: secondaryColorDark,
      contrastText: primaryColor,
    },
    background: {
      default: colorWhite,
    },
    text: {
      primary: textColorPrimary,
      secondary: textColorSecondary,
      hint: textColorSecondary,
    },
    divider: borderColor,
  },

  /* Material font overrides */
  typography: {
    fontFamily: fontMontserrat,
    fontSize: fontSizeMd,
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
  color: {
    gray: colorGray,
    orange: colorOrange,
    red: colorRed,
    gradientPurple,
  },

  padding: {
    unit: spacingUnit,
    xs: spacingXs,
    sm: spacingSm,
    md: spacingMd,
    lg: spacingLg,
    xl: spacingXl,
    custom: (multiplier: number) => spacingUnit * multiplier,
  },

  font: {
    xs: fontSizeXs,
    sm: fontSizeSm,
    md: fontSizeMd,
    lg: fontSizeLg,
    xl: fontSizeXl,
    weight: {
      bold: fontWeightBold,
    },
    lineHeight: {
      xs: lineHeightXs,
      sm: lineHeightSm,
      md: lineHeightMd,
      lg: lineHeightLg,
      xl: lineHeightXl,
    },
  },

  border: {
    root: `${borderColor} solid ${px(borderSize)}`,
    radius: borderRadius,
  },

  icon: {
    size: iconSize,
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
