import React from "react";
import { Text, LogBox, Platform } from "react-native";
import AppNavigator from "./src/AppNavigator";
import AsyncStorage from "@react-native-community/async-storage";
import { PESDK, PhotoEditorModal } from "react-native-photoeditorsdk";
import { VESDK, VideoEditorModal } from "react-native-videoeditorsdk";

import sdklicense from "./src/license/pesdk_android_license";
import VESDKandroidlicense from "./src/license/vesdk_android_license";
// Redux
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import configureStore from "./src/store";
//Firebase
import messaging from "@react-native-firebase/messaging";

//Notification

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

LogBox.ignoreAllLogs();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const { persistor, store } = configureStore();
    this.persistor = persistor;
    this.store = store;
    persistor.persist();
  }

  componentDidMount = () => {
    this.requestUserPermission();
    this.notificationListener();
    if (Platform.OS == "android") {
      PESDK.unlockWithLicense(sdklicense);
      VESDK.unlockWithLicense(VESDKandroidlicense);
    } else {
      // VESDK.unlockWithLicense(VESDKandroidlicense);
      // PESDK.unlockWithLicense(iossdklicense);
    }
  };

  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      this.getFcmToken();
    }
  };
  getFcmToken = async () => {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    if (!fcmToken) {
      try {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          await AsyncStorage.setItem("fcmToken", fcmToken);
        }
      } catch (error) {
        console.log(error, "error raised in facmToken");
      }
    }
  };

  notificationListener = async () => {
    messaging().onNotificationOpenedApp((remoteMessage) => {});

    messaging().onMessage(async (remoteMessage) => {});

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {});
  };
  render() {
    return (
      <Provider store={this.store}>
        <PersistGate persistor={this.persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    );
  }
}
