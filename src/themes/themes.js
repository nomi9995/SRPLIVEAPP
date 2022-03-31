import {
  GRAY,
  LIGHTGRAY,
  Black,
  ONLINE,
  White,
  LIGHTBLACK,
  LIGHTBLACK2,
  RED,
  gradientColor,
  gradientTransparent,
  GREEN
} from './constantColors';

export const THEMES = [
  {
    key: 'DARK',
    gradientColors: gradientColor,
    gradientTransparentColors: gradientTransparent,
    container: {
      backgroundColor: Black,
      headerTextColor: White,
    },
    primaryColor: White,
    secondaryColor: GRAY,
    subSecondaryColor: LIGHTGRAY,
    subPrimaryColor: LIGHTBLACK2,
    onlineColor: ONLINE,
    infoColor: RED,
    chatTheme: {
      backgroundColor: Black,
      left: {
        wrapper: {
          backgroundColor: LIGHTGRAY
        },
        text: {
          color: Black
        }
      },
      right: {
        wrapper: {
          backgroundColor: ONLINE
        },
        text: {
          color: Black
        }
      },
    }
  },
  {
    key: 'LIGHT',
    gradientColors: gradientColor,
    gradientTransparentColors: gradientTransparent,
    container: {
      backgroundColor: White,
      headerTextColor: Black,
    },
    primaryColor: Black,
    secondaryColor: GRAY,
    subSecondaryColor: LIGHTGRAY,
    subPrimaryColor: LIGHTGRAY,
    onlineColor: ONLINE,
    infoColor: RED,
    chatTheme: {
      backgroundColor: Black,
      left: {
        wrapper: {
          backgroundColor: LIGHTGRAY
        },
        text: {
          color: Black
        }
      },
      right: {
        wrapper: {
          backgroundColor: GREEN
        },
        text: {
          color: White
        }
      },
    }
  },
];
