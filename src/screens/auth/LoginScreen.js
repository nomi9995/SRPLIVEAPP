import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Alert,
} from "react-native";

import { White } from "../../themes/constantColors";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import FlashMessage, { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-community/async-storage";
import RNRestart from "react-native-restart";
import Toast from "react-native-simple-toast";

//Redux
import { setAuthUser, setStickers, setReloader } from "../../store/actions";
import { connect } from "react-redux";

//Services
import UserService from "../../services/UserService";
import ChatServices from "../../services/ChatServices";

//DataBase
import {
  MessagesQuieries,
  ChatUsersQuieries,
  LogoutQueries,
} from "../../database/services/Services";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "647@srp.com.tr",
      password: "123456",
      AuthData: null,
      scrollCheck: false,
    };
  }
  componentDidMount = () => {
    MessagesQuieries.delete();
    ChatUsersQuieries.delete();
  };

  onLogin = () => {
    showMessage({
      message: "Please Wait!",
      type: "info",
    });
    this.setState({ loader: true });
    let email = this.state.email;
    let password = this.state.password;
    let device = 2;
    UserService.login({ email, password, device }, true).then((response) => {
      this.PushNotification(response);
      if (response.data.errors.length === 0) {
        showMessage({
          message: "Login Successful",
          type: "success",
          position: { top: 30 },
        });
        Toast.show("Login Successfully.", Toast.SHORT);

        this.setState({ AuthData: response.data.data });
        ChatServices.stickerList(response.data.data.token).then((res) => {
          this.props.onSetStickers(res.data.data.stickers);
        });
        this.localDbMethod();
      } else {
        showMessage({ message: "Login Failed", type: "warning" });
        this.setState({ loader: false });
        if (response.data.errors[0]?.password !== undefined) {
          Alert.alert(response.data.errors[0]?.password[0]);
        } else if (response.data.errors[0]?.email !== undefined) {
          Alert.alert(response.data.errors[0]?.email[0]);
        }
      }
    });
  };

  localDbMethod = () => {
    ChatUsersQuieries.create("users_list_table");
    LogoutQueries.create("logout_time_table");
    MessagesQuieries.create("messages_list_table");

    let token = this.state.AuthData.token;
    let payload = {
      after: this.state.AuthData.user.created_at,
    };

    ChatServices.updatedMessages(payload, token).then((res) => {
      let tableName = "messages_list_table";
      let resp = res;
      let onlineUserId = this.state.AuthData.user.id;

      MessagesQuieries.insertAndUpdateMessageList(
        { tableName, resp, onlineUserId },
        (res3) => {
          this.getUpdateMessageList();
        }
      );
    });
  };

  getUpdateMessageList = () => {
    let token = this.state.AuthData.token;
    ChatServices.ALLUserList(token).then((res, err) => {
      this.props.onSetAuthUser(this.state.AuthData);

      ChatUsersQuieries.insertAndUpdateUserListonlogin(
        "users_list_table",
        res.data.data.chat_list,
        this.props.user.user.id,
        (res4) => {
          if (res4) {
            this.addRecentListToDB();
          }
        }
      );
    });
  };

  addRecentListToDB = () => {
    this.setState({ DataLoader: true });
    let user_list_section = "recent";
    let page = this.state.pageNum;
    let token = this.props.user?.token;
    ChatServices.getUserList({ user_list_section, page }, token).then(
      async (res) => {
        if (res.data.errors == "Unauthorized") {
          Alert.alert(
            "Unauthorized",
            "This user is already logged in on another device.",
            [
              {
                text: "OK",
                onPress: () => {
                  this.props.onSetAuthUser(null);
                  this.props.navigation.replace("LoginScreen");
                },
              },
            ]
          );
        } else {
          if (page > 1) {
          } else {
            ChatUsersQuieries.insertAndUpdateUserListonlogin(
              "users_list_table",
              res.data.data.chat_list,
              this.props.user.user.id,
              (res) => {
                this.setState({ loader: false });
                this.props.onSetReloader(false);
                RNRestart.Restart();
              }
            );
          }
        }
      }
    );
  };

  PushNotification = async (response) => {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    let token = fcmToken;
    let device = response.data.data.device;
    let authtoken = response.data.data.token;

    ChatServices.notificationPush({ token, device }, authtoken).then(
      (res) => {}
    );
  };

  render() {
    const { theme, navigation } = this.props;
    const keyboardVerticalOffset = Platform.OS === "ios" ? -60 : 0;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={{ flexGrow: 1, backgroundColor: "white" }}
        >
          <View
            style={{
              height: "37%",
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <Image
              source={require("../../assets/logo.png")}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View style={{ backgroundColor: "white" }}>
            <View style={{ paddingHorizontal: 20, paddingVertical: "5%" }}>
              <Text style={[styles.titleText, { color: theme.primaryColor }]}>
                Enter Your Email and Password to login
              </Text>
              <View style={{ flexDirection: "row", marginTop: 40 }}>
                <View style={styles.textInput}>
                  <Text
                    style={{
                      paddingVertical: "3%",
                      fontFamily: "Roboto-Medium",
                    }}
                  >
                    Email
                  </Text>
                  <TextInput
                    style={{
                      height: 40,
                      color: theme.primaryColor,
                      paddingLeft: "1%",
                    }}
                    value={this.state.email}
                    placeholder="abc@gmail.com"
                    placeholderTextColor={"grey"}
                    keyboardType={"email-address"}
                    onChangeText={(email) => this.setState({ email })}
                  />
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <View style={styles.textInput}>
                  <Text
                    style={{
                      paddingVertical: "3%",
                    }}
                  >
                    Password
                  </Text>
                  <TextInput
                    style={{
                      height: 45,
                      color: theme.primaryColor,
                    }}
                    value={this.state.password}
                    placeholder="*******"
                    placeholderTextColor={"grey"}
                    keyboardType={"default"}
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={{ alignSelf: "flex-end" }}
                onPress={() => this.props.navigation.navigate("ForgotPassword")}
              >
                <Text style={styles.ForgotText}>Forgot Password</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.continueView}
              onPress={() => this.onLogin()}
            >
              {this.state.loader ? (
                <ActivityIndicator size={"large"} color={"white"} />
              ) : (
                <FontAwesome name={"arrow-right"} size={20} color={"white"} />
              )}
            </TouchableOpacity>
          </View>
          <FlashMessage style={{ marginTop: 20 }} position="top" />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetAuthUser: (user) => {
      dispatch(setAuthUser(user));
    },
    onSetStickers: (stickers) => {
      dispatch(setStickers(stickers));
    },

    onSetReloader: (reloader) => {
      dispatch(setReloader(reloader));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  icon: {
    width: 120,
    height: 90,
    marginTop: "20%",
    alignSelf: "center",
    marginBottom: "10%",
  },

  titleText: {
    marginTop: 45,
    fontSize: 18,
    fontFamily: "Roboto-Regular",
  },

  textInput: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#06A88E",
  },

  continueView: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
    backgroundColor: "#008069",
    marginHorizontal: "5%",
  },

  ForgotText: {
    marginTop: "5%",
    alignSelf: "flex-end",
    marginRight: "3%",
    color: "grey",
    fontFamily: "Roboto-Medium",
  },
});
