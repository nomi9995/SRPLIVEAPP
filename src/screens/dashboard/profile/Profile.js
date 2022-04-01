import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  ImageBackground,
  Image,
  Switch,
  SafeAreaView,
  Pressable,
} from "react-native";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome";
import UserService from "../../../services/UserService";
import appConfig from "../../../utils/appConfig";

//redux
import { connect } from "react-redux";
import { setAuthUser } from "../../../store/actions";
//Component
import BottomModal from "../../../components/BottomModal";
import LogoutOut from "../../../components/Modal/LogoutPop";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      statusModal: false,
      profileData: {},
      changePassword: false,
      LogoutOutPop: false,
    };
  }
  componentDidMount = () => {
    let active_user = this.props?.route?.params?.userProfiledata?.user_id;
    let token = this.props.user?.token;
    UserService.userProfile({ active_user }, token).then((res) => {
      this.setState({ profileData: res.data.data });
    });
  };

  toggleSwitch = () => {
    this.setState({ isEnabled: !this.state.isEnabled });
  };
  closeBottom = (data) => {
    this.setState({ statusModal: data });
  };

  render() {
    let loginUser = this.props?.user?.user;
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ backgroundColor: "#008069" }}>
          <View style={styles.headerview}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.navigation.navigate("Home")}
            >
              <FontAwesome name={"arrow-left"} size={20} color={"white"} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <ScrollView>
          <Pressable
            onPress={() => {
              this.props.navigation.navigate("ProfileImagePreview", {
                url: appConfig.avatarPath + loginUser?.avatar,
              });
            }}
          >
            <ImageBackground
              source={{
                uri: appConfig.avatarPath + loginUser?.avatar,
              }}
              style={styles.profileImage}
            ></ImageBackground>
          </Pressable>
          <View style={styles.mainViewSettings}>
            <View style={styles.personalDetailView}>
              <Text style={styles.personalDetailText}>Personal Details</Text>
              <TouchableOpacity
                style={styles.EditButton}
                onPress={() =>
                  this.props.navigation.navigate("EditProfile", {
                    user: loginUser,
                  })
                }
              >
                <FontAwesome name={"pen-fancy"} size={15} color={"white"} />
              </TouchableOpacity>
            </View>
            <View style={styles.profileDetailView}>
              <View style={styles.profileDetailInnerView}>
                <View style={styles.profileIconContainer}>
                  <FontAwesome name={"user"} size={20} color={"grey"} />
                </View>
                <Text style={[styles.profileDetailText, { marginLeft: -2 }]}>
                  Name
                </Text>
              </View>
              <Text style={styles.profileDetailName}>
                {loginUser?.first_name + " " + loginUser?.last_name}
              </Text>
            </View>
            <View style={styles.profileDetailView}>
              <View style={styles.profileDetailInnerView}>
                <View style={styles.profileIconContainer}>
                  <FontAwesome name={"envelope"} size={20} color={"grey"} />
                </View>
                <Text style={styles.profileDetailText}>Email</Text>
              </View>
              <Text style={styles.profileDetailName} numberOfLines={1}>
                {loginUser?.email}
              </Text>
            </View>
            <View style={styles.profileDetailView}>
              <View style={[styles.profileDetailInnerView]}>
                <View style={styles.profileIconContainer}>
                  <FontAwesome
                    name={"birthday-cake"}
                    size={20}
                    color={"grey"}
                  />
                </View>
                <Text style={styles.profileDetailText}>Birthday</Text>
              </View>
              <Text style={{ marginLeft: "16%" }}>{loginUser?.dob}</Text>
            </View>

            <>
              <View style={styles.profileDetailView}>
                <View style={[styles.profileDetailInnerView]}>
                  <View style={styles.profileIconContainer}>
                    <FontAwesome name={"clock"} size={20} color={"grey"} />
                  </View>
                  <Text style={styles.profileDetailText}>Timezone</Text>
                </View>
                <Text style={{ marginLeft: "12%", color: "grey" }}>
                  {loginUser?.timezone}
                </Text>
              </View>
            </>
            <View style={styles.personalDetailView}>
              <Text style={styles.personalDetailText}>Settings</Text>
            </View>
            <TouchableOpacity
              style={styles.profileDetailView}
              onPress={() => this.setState({ statusModal: true })}
            >
              <View style={styles.profileIconContainer}>
                <FontAwesome5 name={"check-circle"} size={20} color={"grey"} />
              </View>
              <Text style={styles.SettingInner}>Status</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileDetailView}
              onPress={() => this.props.navigation.navigate("DataAndStorge")}
            >
              <View style={styles.profileIconContainer}>
                <FontAwesome name={"database"} size={20} color={"grey"} />
              </View>
              <Text style={styles.SettingInner}>Data and Storage</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileDetailView}
              onPress={() => this.props.navigation.navigate("ChangePassword")}
            >
              <View style={styles.profileIconContainer}>
                <FontAwesome name={"key"} size={20} color={"grey"} />
              </View>
              <Text style={styles.SettingInner}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileDetailView}
              // onPress={() => this.props.onSetAuthUser(null)}
              onPress={() => this.setState({ LogoutOutPop: true })}
            >
              <View style={styles.profileIconContainer}>
                <FontAwesome5 name={"sign-out"} size={20} color={"grey"} />
              </View>
              <Text style={styles.SettingInner}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <BottomModal
          openModal={this.state.statusModal}
          closeBottomModel={() => this.closeBottom(false)}
        />
        {this.state.LogoutOutPop && (
          <LogoutOut
            openLogoutModal={this.state.LogoutOutPop}
            closeLogoutModel={(data) => this.setState({ LogoutOutPop: false })}
          />
        )}
      </View>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileImage: {
    height: 200,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 10,
  },
  mediaLinkView: {
    // marginHorizontal: '2%',
    backgroundColor: "white",
    // elevation: 5,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  MediaButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  rightIcon: {
    paddingHorizontal: 5,
  },
  headerview: {
    backgroundColor: "#008069",
  },
  mediaLinkText: {
    fontWeight: "500",
    marginLeft: 10,
    fontSize: 16,
  },
  imageView: {
    flexDirection: "row",
    marginLeft: 5,
    marginBottom: 5,
  },
  imageMedia: {
    width: 80,
    height: 80,
    marginRight: 5,
    borderRadius: 2,
  },
  profileDetailView: {
    backgroundColor: "#FAFAFA",
    padding: 15,
    marginHorizontal: 5,
    // elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    borderRadius: 5,
  },
  personalDetailView: {
    backgroundColor: "#FAFAFA",
    padding: 10,
    marginHorizontal: 5,
    // elevation: 5,
    marginBottom: 2,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    marginTop: "4%",
    borderRadius: 5,
  },
  personalDetailText: {
    fontSize: 18,
    paddingVertical: 5,
    // fontWeight: '400',
    fontFamily: "Roboto-Medium",
    color: "grey",
  },
  profileDetailInnerView: {
    flexDirection: "row",
    // width: "20%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileIconContainer: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    marginRight: "3%",
  },
  profileDetailText: {
    fontSize: 16,
    color: "grey",
    fontFamily: "Roboto-Bold",
  },
  profileDetailName: {
    marginLeft: "20%",
    color: "grey",
  },
  SettingInner: {
    fontSize: 16,
    color: "grey",
    marginLeft: "1%",
    fontFamily: "Roboto-Bold",
  },
  EditButton: {
    backgroundColor: "#008069",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: 9,
    borderRadius: 30,
  },
  mainViewSettings: {
    marginHorizontal: "1%",
    // marginTop: '2%',
    marginBottom: "5%",
  },
});
