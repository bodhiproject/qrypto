/* eslint-disable no-unused-vars */
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { FontWeightProperty, ColorProperty, FontFamilyProperty, BorderColorProperty, BorderProperty, BorderRadiusProperty, HeightProperty, WidthProperty, FontSizeProperty, LineHeightProperty, PaddingProperty, MarginProperty } from 'csstype';

const px = (value: number): string => value.toString().concat('px');

/* Colors */
const colorWhite: ColorProperty = '#FFFFFF';
const colorGray: ColorProperty = '#747474';
const colorOrange: ColorProperty = '#F5A623';
const colorRed: ColorProperty = '#E50000';

const primaryColor: ColorProperty = '#5539DF';
const primaryColorDark: ColorProperty = '#5539DF';
const primaryColorLight: ColorProperty = '#8E6BF1';

const secondaryColor: ColorProperty = colorWhite;
const secondaryColorLight: ColorProperty = colorWhite;
const secondaryColorDark: ColorProperty = colorWhite;

const textColorPrimary: ColorProperty = '#333333';
const textColorSecondary: ColorProperty = colorGray;

const gradientPurple: ColorProperty = `linear-gradient(300.29deg, ${primaryColorLight} -9.7%, ${primaryColor} 85.28%)`;

/* Padding */
const spacingMultiplier = 4;
const spacingUnit: PaddingProperty<string> | MarginProperty<string> = px(spacingMultiplier * 1); // 4
const spacingXs: PaddingProperty<string> | MarginProperty<string> = px(spacingMultiplier * 2); // 8
const spacingSm: PaddingProperty<string> | MarginProperty<string> = px(spacingMultiplier * 3); // 12
const spacingMd: PaddingProperty<string> | MarginProperty<string> = px(spacingMultiplier * 4); // 16
const spacingLg: PaddingProperty<string> | MarginProperty<string> = px(spacingMultiplier * 5); // 20
const spacingXl: PaddingProperty<string> | MarginProperty<string> = px(spacingMultiplier * 6); // 24

/* Fonts */
const fontMontserrat: FontFamilyProperty = 'Montserrat, sans-serif';
const fontSizeXs: FontSizeProperty<string> = px(10);
const fontSizeSm: FontSizeProperty<string> = px(12);
const fontSizeMd: FontSizeProperty<string> = px(14);
const fontSizeLg: FontSizeProperty<string> = px(16);
const fontSizeXl: FontSizeProperty<string> = px(18);

const fontWeightBold: FontWeightProperty = 'bold';

const lineHeightXs: LineHeightProperty<number> = 12;
const lineHeightSm: LineHeightProperty<number> = 16;
const lineHeightMd: LineHeightProperty<number> = 20;
const lineHeightLg: LineHeightProperty<number> = 24;
const lineHeightXl: LineHeightProperty<number> = 32;

/* Border */
const borderColor: BorderColorProperty = '#CCCCCC';
const borderSize: BorderProperty<string> = px(1);
const borderRadius: BorderRadiusProperty<string> = px(8);

/* Icons */
const iconSize: WidthProperty<string> | HeightProperty<string> = px(24);

/* Button */
const buttonRadiusSm: BorderRadiusProperty<string> = px(16);
const buttonRadiusLg: BorderRadiusProperty<string> = px(24);

const buttonHeightSm: HeightProperty<string> = px(32);
const buttonHeightLg: HeightProperty<string> = px(48);

declare module '@material-ui/core/styles/createMuiTheme' {
  // tslint:disable-next-line:interface-name
  interface Theme {
    color: {
      gray: ColorProperty;
      orange: ColorProperty;
      red: ColorProperty;
      gradientPurple: ColorProperty;
    };
    padding: {
      unit: PaddingProperty<string> | MarginProperty<string>;
      xs: PaddingProperty<string> | MarginProperty<string>;
      sm: PaddingProperty<string> | MarginProperty<string>;
      md: PaddingProperty<string> | MarginProperty<string>;
      lg: PaddingProperty<string> | MarginProperty<string>;
      xl: PaddingProperty<string> | MarginProperty<string>;
      custom(multiplier: number): PaddingProperty<string> | MarginProperty<string>;
    };
    font: {
      xs: FontSizeProperty<string>;
      sm: FontSizeProperty<string>;
      md: FontSizeProperty<string>;
      lg: FontSizeProperty<string>;
      xl: FontSizeProperty<string>;
      weight: {
        bold: FontWeightProperty;
      };
      lineHeight: {
        xs: LineHeightProperty<number>;
        sm: LineHeightProperty<number>;
        md: LineHeightProperty<number>;
        lg: LineHeightProperty<number>;
        xl: LineHeightProperty<number>;
      };
    };
    border: {
      root: BorderProperty<string>;
      radius: BorderRadiusProperty<string>;
    };
    icon: {
      size: WidthProperty<string> | HeightProperty<string>;
    };
    button: {
      sm: {
        height: HeightProperty<string>;
        radius: BorderRadiusProperty<string>;
      };
      lg: {
        height: HeightProperty<string>;
        radius: BorderRadiusProperty<string>;
      };
    };
  }
  // allow configuration using `createMuiTheme`
  // tslint:disable-next-line:interface-name
  interface ThemeOptions {
    color?: {
      gray?: ColorProperty;
      orange?: ColorProperty;
      red?: ColorProperty;
      gradientPurple?: ColorProperty;
    };
    padding?: {
      unit?: PaddingProperty<string> | MarginProperty<string>;
      xs?: PaddingProperty<string> | MarginProperty<string>;
      sm?: PaddingProperty<string> | MarginProperty<string>;
      md?: PaddingProperty<string> | MarginProperty<string>;
      lg?: PaddingProperty<string> | MarginProperty<string>;
      xl?: PaddingProperty<string> | MarginProperty<string>;
      custom?(multiplier: number): PaddingProperty<string> | MarginProperty<string>;
    };
    font?: {
      xs?: FontSizeProperty<string>;
      sm?: FontSizeProperty<string>;
      md?: FontSizeProperty<string>;
      lg?: FontSizeProperty<string>;
      xl?: FontSizeProperty<string>;
      weight?: {
        bold: FontWeightProperty;
      };
      lineHeight?: {
        xs: LineHeightProperty<number>;
        sm: LineHeightProperty<number>;
        md: LineHeightProperty<number>;
        lg: LineHeightProperty<number>;
        xl: LineHeightProperty<number>;
      };
    };
    border?: {
      root?: BorderProperty<string>;
      radius?: BorderRadiusProperty<string>;
    };
    icon?: {
      size?: WidthProperty<string> | HeightProperty<string>;
    };
    button?: {
      sm?: {
        height?: HeightProperty<string>;
        radius?: BorderRadiusProperty<string>;
      };
      lg?: {
        height?: HeightProperty<string>;
        radius?: BorderRadiusProperty<string>;
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
    fontSize: 14,
  },

  /* Material component overrides */
  overrides: {
    MuiCardContent: {
      root: {
        padding: `0px !important`,
      },
    },
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
    MuiSelect: {
      select: {
        padding: 0,
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
    custom: (multiplier: number) => px(spacingMultiplier * multiplier),
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
    root: `${borderColor} solid ${borderSize}`,
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
