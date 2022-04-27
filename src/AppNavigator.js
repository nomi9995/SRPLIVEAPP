import React from "react";
import { StatusBar, AppState } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import moment from "moment";

//Screens
import InstructionScreen from "../src/screens/auth/instructionScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import LoadingMessages from "./screens/auth/LoadingMessages";

import homeScreen from "./screens/dashboard/homeScreen";
import MessageScreen from "./screens/dashboard/message/messageScreen";
import TestMessageScreen from "./screens/dashboard/message/TestMessageScreen";
import Profile from "./screens/dashboard/profile/Profile";
import AllList from "./screens/dashboard/userList/AllList";
import GroupList from "./screens/dashboard/userList/groupList";
import ForwardContactList from "./screens/dashboard/userList/ForwardContactList";
import ChangePassword from "./screens/auth/ChangePssword";
import MediaLinkDoc from "./screens/dashboard/profile/MediaLinkDoc";
import StarredList from "./screens/messageActions/StarredList";
import AcknowledgementMessage from "./screens/messageActions/AcknowledgementMessage";
import RespondLater from "./screens/messageActions/RespondLater";
import NotificationList from "./screens/messageActions/NotificationList";
import Favourite from "./screens/messageActions/Favourite";
import EditProfile from "./screens/auth/EditProfile";
import ChatUserProfile from "./screens/dashboard/profile/ChatUserProfile";
import ForgotPassword from "./screens/auth/ForgotPassword";
import DataAndStorge from "./screens/dashboard/profile/DataAndStorge";
import StatusViewer from "./screens/dashboard/storyTab/StatusViewerScreen";
import MyStoryView from "./screens/dashboard/storyTab/MyStoryView";
import MessagePreview from "./screens/dashboard/message/MessagePreview";
import SearchList from "./screens/dashboard/search/SearchListPage";
import ForwardContactListSearch from "./screens/dashboard/search/forwardContactList";
import ProfileImagePreviewscreen from "./screens/dashboard/profile/profileImage";

//Redux
import { setAppCloseTime } from "./store/actions";
import { connect } from "react-redux";

let RootStack = createStackNavigator();
let DashboardStack = createStackNavigator();
let MainStack = createStackNavigator();

const navigationOption = () => {
  return {
    headerShown: false,
    headerBackTitleVisible: false,
  };
};

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={navigationOption()}>
      <MainStack.Screen name="Home" component={homeScreen} />
      <MainStack.Screen name="MessageScreen" component={MessageScreen} />
      <MainStack.Screen
        name="TestMessageScreen"
        component={TestMessageScreen}
      />
      <MainStack.Screen name="Profile" component={Profile} />
      <MainStack.Screen name="AllList" component={AllList} />
      <MainStack.Screen name="GroupList" component={GroupList} />
      <MainStack.Screen
        name="ForwardContactList"
        component={ForwardContactList}
      />
      <MainStack.Screen name="ChangePassword" component={ChangePassword} />
      <MainStack.Screen name="MediaLinkDoc" component={MediaLinkDoc} />
      <MainStack.Screen name="EditProfile" component={EditProfile} />
      <MainStack.Screen name="ChatUserProfile" component={ChatUserProfile} />
      <MainStack.Screen name="DataAndStorge" component={DataAndStorge} />
      <MainStack.Screen
        name="StatusViewer"
        component={StatusViewer}
        options={{
          animationEnabled: false,
        }}
      />
      <MainStack.Screen name="MyStoryView" component={MyStoryView} />
      <MainStack.Screen name="MessagePreview" component={MessagePreview} />
      <MainStack.Screen name="SearchList" component={SearchList} />
      <MainStack.Screen
        name="ForwardContactListSearch"
        component={ForwardContactListSearch}
      />
      <MainStack.Screen
        name="ProfileImagePreview"
        component={ProfileImagePreviewscreen}
      />
    </MainStack.Navigator>
  );
}

class AppNavigator extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setAppCloseTimeRedux();
  }

  setAppCloseTimeRedux = () => {
    AppState.addEventListener("change", async (state) => {
      let date = moment.utc().zone("+0100").format("YYYY-MM-DD HH:mm:ss");
      if (state === "background") {
        this.props.onSetAppCloseTime(date);
      } else if (state === "inactive") {
        this.props.onSetAppCloseTime(date);
      }
    });
  };

  render() {
    return (
      <>
        <StatusBar
          backgroundColor="#008069"
          barStyle="dark-content"
          showHideTransition=""
        />
        <NavigationContainer>
          {this.props.user === null ? (
            <RootStack.Navigator screenOptions={navigationOption()}>
              <RootStack.Screen
                name="InstructionScreen"
                component={InstructionScreen}
              />
              <RootStack.Screen name="LoginScreen" component={LoginScreen} />
              <RootStack.Screen
                name="LoadingMessages"
                component={LoadingMessages}
              />
              <RootStack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
              />
            </RootStack.Navigator>
          ) : (
            <DashboardStack.Navigator
              mode="modal"
              screenOptions={navigationOption()}
            >
              <DashboardStack.Screen name="Home" component={MainStackScreen} />
              <DashboardStack.Screen
                name="StarredList"
                component={StarredList}
              />
              <DashboardStack.Screen
                name="AcknowledgementMessage"
                component={AcknowledgementMessage}
              />
              <DashboardStack.Screen
                name="RespondLater"
                component={RespondLater}
              />
              <DashboardStack.Screen
                name="NotificationList"
                component={NotificationList}
              />
              <DashboardStack.Screen name="Favourite" component={Favourite} />
            </DashboardStack.Navigator>
          )}
        </NavigationContainer>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetAppCloseTime: (time) => {
      dispatch(setAppCloseTime(time));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
