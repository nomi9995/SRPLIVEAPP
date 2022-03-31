import * as ACTION_TYPES from '../types';
import {StateHandler} from '../models';

export default (state = StateHandler, action) => {
  const {type, payload, error} = action;
  switch (type) {
    case ACTION_TYPES.MEDIA_OPTIONS_OPEN:
      return {...state, mediaOptionsOpen: payload};

    case ACTION_TYPES.STICKERS_OPEN:
      return {...state, stickerOpen: payload};

    case ACTION_TYPES.MEDIA_TYPE:
      return {...state, mediaType: payload};

    case ACTION_TYPES.IMAGE_PREVIEW:
      return {...state, imagePreview: payload};
  
    case ACTION_TYPES.REPLY_STATE:
      return {...state, replyState: payload};
      
    case ACTION_TYPES.MEDIA_UPLOAD_STATE:
      return {...state, mediaUploadState: payload};
    
    case ACTION_TYPES.SCROLL_STATE:
      return {...state, scrollState: payload};
    
    case ACTION_TYPES.SEARCH_QUERY:
      return {...state, searchQuery: payload};
    
    case ACTION_TYPES.SEARCH_STATE:
      return {...state, searchState: payload};

    case ACTION_TYPES.SEARCH_SHOW:
      return {...state, searchShow: payload};

    case ACTION_TYPES.STATUS_STATE:
      return {...state, statusState: payload};
      
    case ACTION_TYPES.SET_RELOADER:
      return {...state, setreloader: payload};
    
    case ACTION_TYPES.PREVIEW_TYPE:
      return {...state, previewType: payload};

    case ACTION_TYPES.RENDER_STATE:
      return {...state, renderstate: payload};
      
    case ACTION_TYPES.MESSAGE_EDIT:
      return {...state, messageEdit: payload};

    case ACTION_TYPES.MESSAGE_TEXT:
      return {...state, messageText: payload};

    default:
      return state;
  }
};
