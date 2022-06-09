import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  Keyboard,
  Platform,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";

import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-community/async-storage";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import FlashMessage, { showMessage } from "react-native-flash-message";

//Redux
import { connect } from "react-redux";

//Services
import UserService from "../../services/UserService";
import ChatServices from "../../services/ChatServices";

//DataBase
import {
  MessagesQuieries,
  ChatUsersQuieries,
} from "../../database/services/Services";

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "639@srp.com.tr",
      password: "123456",
    };
  }
  componentDidMount = () => {
    MessagesQuieries.delete();
    ChatUsersQuieries.delete();
  };

  onLogin = () => {
    Keyboard.dismiss();
    showMessage({
      message: "Please Wait!",
      type: "info",
    });

    let email = this.state.email;
    let password = this.state.password;
    let device = 2;

    UserService.login({ email, password, device }, true).then(
      async (response) => {
        this.PushNotification(response);
        if (response.data.errors.length === 0) {
          showMessage({
            message: "Login Successful",
            type: "success",
            position: { top: 30 },
          });
          Toast.show("Login Successfully.", Toast.SHORT);

          this.props.navigation.replace("LoadingMessages", {
            token: response.data.data,
          });
          AsyncStorage.setItem("authData", JSON.stringify(response.data.data));
        } else {
          showMessage({ message: "Login Failed", type: "warning" });
          if (response.data.errors[0]?.password !== undefined) {
            Alert.alert(response.data.errors[0]?.password[0]);
          } else if (response.data.errors[0]?.email !== undefined) {
            Alert.alert(response.data.errors[0]?.email[0]);
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
    const { theme } = this.props;
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
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
