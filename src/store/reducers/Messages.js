import * as ACTION_TYPES from '../types';
import {Messages} from '../models';

export default (state = Messages, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case ACTION_TYPES.ON_LONG_PRESS:
      const arr = payload;
      const uniqObjs = [];
      const dupeObjs = [];
      arr.forEach(obj =>
        [uniqObjs, dupeObjs][
          +(arr.map(obj => obj._id).filter(_id => _id === obj._id).length > 1)
        ].push(obj),
      );
      return {...state, longPress: uniqObjs};

    case ACTION_TYPES.NAVIAGTE_REPLY_MESSAGE:
      return {...state, navReply: payload};

    default:
      return state;
  }
};
