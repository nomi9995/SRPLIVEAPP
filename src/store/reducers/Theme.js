import * as ACTION_TYPES from '../types';
import { Theme } from '../models';

export default (state = Theme, action) => {
  const { type, payload, error } = action;
  switch (type) {

    case ACTION_TYPES.THEME:
      return { ...state, theme: payload };

    default:
      return state;
  }
};
