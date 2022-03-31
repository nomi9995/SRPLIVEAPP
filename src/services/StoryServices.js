import ApiManager from "./ApiManager";
import Resources, { Singleton } from "./Resources";

class StoryServices extends Resources {
  authUser = {};
  routes = {
    storyList: "story-list",
   
  };

  constructor() {
    super(arguments);
  }

  setAuthUser(user) {
    if (user) {
      this.authUser = user;
    }
  }

  storyList = (token) => {
    return ApiManager.get(this.routes.storyList, null , token);
  };

  
}

export default Singleton(StoryServices);
