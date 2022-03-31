import * as ACTION_TYPES from '../types';
import { Stickers } from '../models';

export default (state = Stickers, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case ACTION_TYPES.STICKERS:
      return { ...state, stickers: payload, loading: false };
  
      case ACTION_TYPES.APP_CLOSE_TIME:
      return { ...state, appCloseTime: payload,};

    default:
      return state;
  }
};
