import * as ACTION_TYPES from '../types';
import {ScrollPosition} from '../models';

export default (state = ScrollPosition, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case ACTION_TYPES.SCROLL_POSITION:
      return {...state, scrollPosition: payload, loading: false};

    default:
      return state;
  }
};
