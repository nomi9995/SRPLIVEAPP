import ApiManager from "./ApiManager";
import Resources, { Singleton } from "./Resources";

class ChatServices extends Resources {
  authUser = {};
  routes = {
    userList: "user-list",
    userChat: "chats",
    uploadFile: "send-files",
    starredList: "starred-list",
    stickersList: "stickers-list",
    forwardMessage: "chat-forward",
    acknowledgeList: "ack-list",
    notificationList: "notification-list",
    chatSearch: "chat-search",
    starMessage: "message-star",
    deleteMessage: "message-delete",
    acknowledgeRequest:"ack-request",
    reponselater: "respond-later-list",
    acknowledgeAccept: "ack-accept",
    remindMeLater: "message-remind",
    forwardSingleImage: "chat-forward-image",
    notificationPush:"update-push-device",
    updatedMessages:"updated-messages",
    reponseLaterRequest:'message-respond-later',
    editMessage:'message-edit',
    ALLUserList:'user-list-all',
  };

  constructor() {
    super(arguments);
  }

  getUserList = (payload, token) => {
    return ApiManager.post(this.routes.userList, payload, false, token);
  };

  getUserChat = (payload, token) => {
    return ApiManager.post(this.routes.userChat, payload, false, token);
  }

  uploadFile = (payload, token) => {
    return ApiManager.post(this.routes.uploadFile, payload, true, token);
  }

  starredList = (token) => {
    return ApiManager.get(this.routes.starredList, null, token);
  };

  reponselater = (token) => {
    return ApiManager.get(this.routes.reponselater, null, token);
  };

  acknowledgeList = (token) => {
    return ApiManager.get(this.routes.acknowledgeList, null, token);
  };

  notificationList = (token) => {
    return ApiManager.get(this.routes.notificationList, null, token);
  };

  stickerList = (token) => {
    return ApiManager.get(this.routes.stickersList, null, token);
  };

  forwardMessage = (payload, token) => {
    return ApiManager.post(this.routes.forwardMessage, payload, false, token);
  };
  
  SearchChat = (payload, token) => {
    return ApiManager.post(this.routes.chatSearch, payload, false, token);
  };
  
  starMessage = (payload, token) => {
    return ApiManager.post(this.routes.starMessage, payload, false, token);
  };
  
  deleteMessage = (payload, token) => {
    return ApiManager.post(this.routes.deleteMessage, payload, false, token);
  };
  
  acknowledgeRequest = (payload, token) => {
    return ApiManager.post(this.routes.acknowledgeRequest, payload, false, token);
  };
  
  acknowledgeAccept = (payload, token) => {
    return ApiManager.post(this.routes.acknowledgeAccept, payload, false, token);
  };
  
  remindMeLater = (payload, token) => {
    return ApiManager.post(this.routes.remindMeLater, payload, false, token);
  };
  
  forwardSingleImage = (payload, token) => {
    return ApiManager.post(this.routes.forwardSingleImage, payload, false, token);
  };

  notificationPush = (payload, token) => {
    return ApiManager.post(this.routes.notificationPush, payload, false, token);
  };
  
  updatedMessages = (payload, token) => {
    return ApiManager.post(this.routes.updatedMessages, payload, false, token);
  };

  reponseLaterRequest = (payload, token) => {
    return ApiManager.post(this.routes.reponseLaterRequest, payload, false, token);
  };
  
  editMessage = (payload, token) => {
    return ApiManager.post(this.routes.editMessage, payload, false, token);
  };

  ALLUserList = (token) => {
    return ApiManager.get(this.routes.ALLUserList, null, token);
  };

}

export default Singleton(ChatServices);
