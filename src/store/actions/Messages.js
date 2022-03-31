import * as ACTION_TYPES from '../types';

export const setOnLongPress = payload => ({
  type: ACTION_TYPES.ON_LONG_PRESS,
  payload: payload,
});

export const setReplyNavigate = payload => ({
  type: ACTION_TYPES.NAVIAGTE_REPLY_MESSAGE,
  payload: payload,
});