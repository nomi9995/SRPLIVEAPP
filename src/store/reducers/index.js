import {combineReducers} from 'redux';
import theme from './Theme';
import auth from './AuthUser';
import stickers from './Stickers';
import stateHandler from './StateHandler';
import messages from './Messages';
import autoDownload from './autoDownload';
import ScrollPosition from './ScrollPosition';

export default combineReducers({
  theme,
  auth,
  stickers,
  stateHandler,
  messages,
  autoDownload,
  ScrollPosition,
});
