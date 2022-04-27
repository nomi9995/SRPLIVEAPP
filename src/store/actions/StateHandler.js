import * as ACTION_TYPES from "../types";

export const setMediaOptionsOpen = (payload) => ({
  type: ACTION_TYPES.MEDIA_OPTIONS_OPEN,
  payload: payload,
});

export const setSickerOpen = (payload) => ({
  type: ACTION_TYPES.STICKERS_OPEN,
  payload: payload,
});

export const setMediaType = (payload) => ({
  type: ACTION_TYPES.MEDIA_TYPE,
  payload: payload,
});

export const setImagePreview = (payload) => ({
  type: ACTION_TYPES.IMAGE_PREVIEW,
  payload: payload,
});

export const setReplyState = (payload) => ({
  type: ACTION_TYPES.REPLY_STATE,
  payload: payload,
});

export const setMediaUploadState = (payload) => ({
  type: ACTION_TYPES.MEDIA_UPLOAD_STATE,
  payload: payload,
});

export const setScrollState = (payload) => ({
  type: ACTION_TYPES.SCROLL_STATE,
  payload: payload,
});

export const setSearchQuery = (payload) => ({
  type: ACTION_TYPES.SEARCH_QUERY,
  payload: payload,
});

export const setSearchState = (payload) => ({
  type: ACTION_TYPES.SEARCH_STATE,
  payload: payload,
});

export const setSearchShow = (payload) => ({
  type: ACTION_TYPES.SEARCH_SHOW,
  payload: payload,
});

export const setStatusState = (payload) => ({
  type: ACTION_TYPES.STATUS_STATE,
  payload: payload,
});

export const setPreviewType = (payload) => ({
  type: ACTION_TYPES.PREVIEW_TYPE,
  payload: payload,
});

export const setMessageEdit = (payload) => ({
  type: ACTION_TYPES.MESSAGE_EDIT,
  payload: payload,
});

export const setMessageText = (payload) => ({
  type: ACTION_TYPES.MESSAGE_TEXT,
  payload: payload,
});

export const setRenderState = (payload) => ({
  type: ACTION_TYPES.RENDER_STATE,
  payload: payload,
});

export const setAudioPlayState = (payload) => ({
  type: ACTION_TYPES.AUDIO_PLAY_STATE,
  payload: payload,
});
