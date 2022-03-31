import ApiManager from "./ApiManager";
import Resources, { Singleton } from "./Resources";

class UserService extends Resources {
  authUser = {};
  routes = {
    login: "auth",
    register: "register",
    resource: "users",
    profile: "chat-info",
    userGet: "user",
    userProfileUpdate: "save-profile",
    status_update: "user-status",
    userrestriction:"user-restriction",
    searchUser: "user-search",
    respondLater:"message-respond-later",
    chatInfo:"chat-info",
    callLog:'call-list',
    changePassword:'change-password',
    resetPassword:'forgot-password',
    deletePushToken:'delete-push-device',
    compressionImage:'user-image-compression'
  };

  constructor() {
    super(arguments);
  }

  setAuthUser(user) {
    if (user) {
      this.authUser = user;
    }
  }

  login = (payload) => {
    // ApiManager.removeAuth();
    return ApiManager.post(this.routes.login, payload);
  };

  register = (payload) => {
    return ApiManager.post(this.routes.register, payload);
  };

  userProfile = (payload, token) => {
    return ApiManager.post(this.routes.profile, payload, false, token);
  };
  
  getUser = (payload, token) => {
    return ApiManager.post(this.routes.userGet, payload, false, token);
  };
 
  userProfileUpdate = (payload, token) => {
    return ApiManager.post(this.routes.userProfileUpdate, payload, false, token);
  };

  UpdateuserStautus = (payload, token) => {
    return ApiManager.post(this.routes.status_update, payload, false, token);
  };

  UserRestriction = (payload, token) => {
    return ApiManager.post(this.routes.userrestriction, payload, false, token);
  }

  searchUserList = (payload, token) => {
    return ApiManager.post(this.routes.searchUser, payload, false, token);
  };

  respondLater = (payload, token) => {
    return ApiManager.post(this.routes.respondLater, payload, false, token);
  };

  chatInfo = (payload, token) => {
    return ApiManager.post(this.routes.chatInfo, payload, false, token);
  };

  callLog = (token) => {
    return ApiManager.get( this.routes.callLog, null ,token);
  };

  changePassword = (payload, token) => {
    return ApiManager.post(this.routes.changePassword, payload, false, token);
  };

  resetPassword = (payload) => {
    return ApiManager.post(this.routes.resetPassword, payload);
  };
  
  deletePushToken = (payload, token) => {
    return ApiManager.post(this.routes.deletePushToken, payload, false, token);
  };

  compressionImage = (payload, token) => {
    return ApiManager.post(this.routes.compressionImage, payload, false, token);
  };
}

export default Singleton(UserService);
