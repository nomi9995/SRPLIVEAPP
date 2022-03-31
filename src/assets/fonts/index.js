
  
/*
TextaAltBlack
TextaAltBold
TextaAltBlackIt
TextaAltHeavy
TextaAltRegular
TextaThintIt
TextaMedium
TextaMediumIt
TextaBold
TextaLight
TextaLightIt
TextaBoldIt
TextaThin
TextaRegular
TextaIt
TextaHeavyIt
TextaBook
TextaBookIt
TextaBlackIt
*/

import {Platform} from 'react-native';

const DEFAULT = {
  UbuntuR :'Ubuntu-R',
  UbuntuL :'Ubuntu-L',
  UbuntuM :'Ubuntu-M',

};

const FONT_ANDROID = {
  UbuntuR :'Ubuntu-R',
  UbuntuL :'Ubuntu-L',
  UbuntuM :'Ubuntu-M',

};

const AppFonts = Platform.select({
  ios: DEFAULT,
  android: FONT_ANDROID,
});

export default AppFonts;
