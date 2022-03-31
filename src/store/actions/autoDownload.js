import * as ACTION_TYPES from '../types';

export const setAutoPhotoDownload = payload => ({
  type: ACTION_TYPES.AUTO_PHOTO_DOWNLOAD,
  payload: payload,
});
export const setAutoVideoDownload = payload => ({
  type: ACTION_TYPES.AUTO_VIDEO_DOWNLOAD,
  payload: payload,
});
export const setAutoDocDownload = payload => ({
  type: ACTION_TYPES.AUTO_DOCS_DOWNLOAD,
  payload: payload,
});
