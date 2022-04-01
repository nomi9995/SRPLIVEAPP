import * as ACTION_TYPES from '../types';

export const setScrollPosition = payload => ({
  type: ACTION_TYPES.SCROLL_POSITION,
  payload: payload,
});
