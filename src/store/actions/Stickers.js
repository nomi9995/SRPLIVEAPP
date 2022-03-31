import * as ACTION_TYPES from '../types';

export const setStickers = payload => ({
  type: ACTION_TYPES.STICKERS,
  payload: payload,
});

export const setAppCloseTime = payload => ({
  type: ACTION_TYPES.APP_CLOSE_TIME,
  payload: payload,
});