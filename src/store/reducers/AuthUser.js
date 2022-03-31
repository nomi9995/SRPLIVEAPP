import * as ACTION_TYPES from '../types';
import { AuthUser } from '../models';

export default (state = AuthUser, action) => {
  const { type, payload, error } = action;
  switch (type) {
    case ACTION_TYPES.LOGIN:
      return { ...state, user: payload, loading: false };

    default:
      return state;
  }
};
