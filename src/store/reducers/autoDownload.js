import * as ACTION_TYPES from '../types';
import {autoDownload} from '../models';

export default (state = autoDownload, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case ACTION_TYPES.AUTO_VIDEO_DOWNLOAD:
      return {...state, video: payload};
    case ACTION_TYPES.AUTO_PHOTO_DOWNLOAD:
      return {...state, photo: payload};
    case ACTION_TYPES.AUTO_DOCS_DOWNLOAD:
      return {...state, docs: payload};

    default:
      return state;
  }
};
