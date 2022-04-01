import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ImageBackground,
  Switch,
  BackHandler,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import SimpleLineIcons from "react-native-vector-icons/dist/SimpleLineIcons";
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons";
import Fontisto from "react-native-vector-icons/dist/Fontisto";
import Icon from "react-native-vector-icons/dist/FontAwesome";
import UserService from "../../../services/UserService";
import appConfig from "../../../utils/appConfig";
import FastImage from "react-native-fast-image";
import moment from "moment";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
//redux
import { connect } from "react-redux";
import { setAuthUser } from "../../../store/actions";

class ChatUserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      statusModal: false,
      profileData: {},
      changePassword: false,
      isFavourite: false,
      groupData: null,
    };
  }
  componentDidMount = () => {
    let active_user = this.props?.route?.params?.userProfiledata?.user_id;
    let token = this.props.user?.token;
    UserService.userProfile({ active_user }, token).then((res) => {
      if (res.data.data.info.is_favourite === 1) {
        this.setState({ isFavourite: true });
      } else {
        this.setState({ isFavourite: false });
      }
      this.setState({ profileData: res.data.data });
    });

    this.groupData();
    BackHandler.addEventListener("hardwareBackPress", this.hardwareBack);
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener("hardwareBackPress", this.hardwareBack);
  };

  hardwareBack = () => {
    this.props.navigation.goBack();
    return true;
  };

  groupData = () => {
    if (this.props?.route?.params?.userProfiledata?.is_room === 1) {
      let token = this.props?.user?.token;
      let active_room = this.props?.route?.params?.userProfiledata?.user_id;
      UserService.chatInfo({ active_room }, token).then(async (res) => {
        await this.setState({ groupData: res.data.data });
      });
    } else {
      let token = this.props?.user?.token;
      let active_room = this.props?.route?.params?.userProfiledata?.id;
      UserService.chatInfo({ active_room }, token).then(async (res) => {
        await this.setState({ groupData: res.data.data });
      });
    }
  };

  toggleSwitch = () => {
    this.setState({ isEnabled: !this.state.isEnabled });
  };

  favToggleSwitch = () => {
    let chat_meta_id = this.props.route?.params?.userProfiledata.chat_meta_id;
    let current_status = this.state.profileData?.info.is_favourite;
    let restriction_type = "is_favourite";
    let token = this.props.user?.token;
    UserService.UserRestriction(
      { chat_meta_id, current_status, restriction_type },
      token
    ).then((res) => {});
    this.setState({ isFavourite: !this.state.isFavourite });
  };

  render() {
    let chatUser = this.state.profileData?.info;
    let active_user = this.props?.route?.params?.userProfiledata;
    let photos = active_user.type
      ? this.state.groupData?.shared_photos
      : this.state.profileData?.shared_photos;
    return (
      <View style={styles.container}>
        {chatUser === undefined ? (
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <ActivityIndicator size={"large"} color={"green"} />
          </View>
        ) : (
          <>
            <SafeAreaView style={{ backgroundColor: "#008069" }}>
              <View style={styles.headerview}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <FontAwesome name={"arrow-left"} size={20} color={"white"} />
                </TouchableOpacity>
              </View>
            </SafeAreaView>
            <ScrollView>
              <Pressable
                onPress={() => {
                  this.props.navigation.navigate("ProfileImagePreview", {
                    url: chatUser?.avatar_url,
                  });
                }}
              >
                <ImageBackground
                  // source={require('../../../assets/deafultimage.png')}
                  source={{ uri: chatUser?.avatar_url }}
                  style={styles.profileImage}
                ></ImageBackground>
              </Pressable>

              <View style={styles.mediaLinkView}>
                <View style={styles.MediaButton}>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("MediaLinkDoc", {
                        item: active_user.type
                          ? this.state.groupData
                          : this.state.profileData,
                      })
                    }
                  >
                    <Text style={styles.mediaLinkText}>
                      Media,Links and docs
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rightIcon}
                    onPress={() =>
                      this.props.navigation.navigate("MediaLinkDoc", {
                        item: active_user.type
                          ? this.state.groupData
                          : this.state.profileData,
                      })
                    }
                  >
                    <FontAwesome
                      name={"chevron-right"}
                      size={20}
                      color={"grey"}
                      style={{ marginHorizontal: "2%" }}
                    />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={styles.imageView}>
                    <>
                      {photos === undefined || photos === null ? (
                        <Text
                          style={{
                            color: "grey",
                            paddingLeft: windowWidth * 0.02,
                          }}
                        >
                          No Image
                        </Text>
                      ) : (
                        <>
                          {photos.map((res) => {
                            if (
                              JSON.parse(res.message)?.content !== undefined
                            ) {
                              return JSON.parse(res.message).content.map(
                                (data, key) => {
                                  return (
                                    <FastImage
                                      style={styles.imageMedia}
                                      source={{
                                        uri: appConfig.imagePath + data,
                                      }}
                                    />
                                  );
                                }
                              );
                            } else {
                              <Text></Text>;
                            }
                          })}
                        </>
                      )}
                    </>
                  </View>
                </ScrollView>
              </View>
              {active_user.type ? (
                <>
                  <View style={styles.personalDetailView}>
                    <Text style={styles.personalDetailText}>Participants</Text>
                  </View>
                  {this.state.groupData?.room_users.map((user) => {
                    return (
                      <TouchableOpacity style={styles.container1}>
                        <TouchableOpacity style={{ marginHorizontal: "5%" }}>
                          <View style={styles.profileView}>
                            <FastImage
                              style={styles.profileImageUser}
                              source={
                                user.avatar === "" || user.avatar === null
                                  ? require("../../../assets/deafultimage.png")
                                  : { uri: appConfig.avatarPath + user.avatar }
                              }
                            />
                          </View>
                        </TouchableOpacity>
                        <View style={styles.infoView1}>
                          <View style={styles.nameView}>
                            <Text style={styles.nameText} numberOfLines={1}>
                              {user.first_name + " " + user.last_name}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              ) : (
                <>
                  <View style={{ marginHorizontal: "1%", marginTop: "3%" }}>
                    <View style={styles.personalDetailView}>
                      <Text style={styles.personalDetailText}>
                        Personal Details
                      </Text>
                    </View>
                    <View style={styles.profileDetailView}>
                      <View style={styles.profileDetailInnerView}>
                        <View style={styles.profileIconContainer}>
                          <FontAwesome name={"user"} size={20} color={"grey"} />
                        </View>
                        <Text
                          style={[styles.profileDetailText, { marginLeft: -3 }]}
                        >
                          Name
                        </Text>
                      </View>
                      <Text style={styles.profileDetailName}>
                        {chatUser?.first_name + " " + chatUser?.last_name}
                      </Text>
                    </View>
                    <View style={styles.profileDetailView}>
                      <View style={styles.profileDetailInnerView}>
                        <View style={styles.profileIconContainer}>
                          <FontAwesome
                            name={"envelope"}
                            size={20}
                            color={"grey"}
                          />
                        </View>
                        <Text style={styles.profileDetailText}>Email</Text>
                      </View>
                      <Text style={styles.profileDetailName} numberOfLines={1}>
                        {chatUser?.email}
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
                      <Text style={{ marginLeft: "14%", color: "grey" }}>
                        {chatUser?.dob}
                      </Text>
                    </View>
                    <View style={styles.profileDetailView}>
                      <View style={[styles.profileDetailInnerView]}>
                        <View style={styles.profileIconContainer}>
                          <FontAwesome
                            name={"eye"}
                            size={20}
                            color={"grey"}
                            style={{ marginLeft: -2 }}
                          />
                        </View>
                        <Text style={styles.profileDetailText}>Last Seen</Text>
                      </View>
                      <Text style={{ marginLeft: "12%", color: "grey" }}>
                        {moment.utc(chatUser?.last_seen).local("tr").fromNow()}
                      </Text>
                    </View>
                    <View style={styles.profileDetailView}>
                      <View style={[styles.profileDetailInnerView]}>
                        <View style={styles.profileIconContainer}>
                          <FontAwesome
                            name={"building"}
                            size={20}
                            color={"grey"}
                          />
                        </View>
                        <Text style={styles.profileDetailText}>Company</Text>
                      </View>
                      <Text
                        style={{
                          marginLeft: "13%",
                          width: "50%",
                          color: "grey",
                        }}
                        numberOfLines={1}
                      >
                        {chatUser?.user_departments}
                      </Text>
                    </View>
                    <View style={styles.profileDetailView}>
                      <View style={[styles.profileDetailInnerView]}>
                        <View style={styles.profileIconContainer}>
                          <FontAwesome
                            name={"clock"}
                            size={20}
                            color={"grey"}
                          />
                        </View>
                        <Text style={styles.profileDetailText}>Timezone</Text>
                      </View>
                      <Text style={{ marginLeft: "12%", color: "grey" }}>
                        {chatUser?.timezone}
                      </Text>
                    </View>
                  </View>
                </>
              )}
              <View
                style={{
                  marginHorizontal: "1%",
                  marginTop: "3%",
                  marginBottom: "5%",
                }}
              >
                <View style={styles.personalDetailView}>
                  <Text style={styles.personalDetailText}>Settings</Text>
                </View>

                <View style={[styles.profileDetailView, styles.settingCard]}>
                  <View style={styles.settingInnerView}>
                    <Icon name={"bell-o"} size={20} color={"grey"} />
                    <Text style={styles.SettingInner}>Mute Notifications</Text>
                  </View>
                  <Switch
                    trackColor={{ false: "lightgrey", true: "green" }}
                    thumbColor={this.state.isEnabled ? "green" : "lightgrey"}
                    ios_backgroundColor="lightgrey"
                    onValueChange={() =>
                      this.toggleSwitch(this.state.isEnabled)
                    }
                    value={this.state.isEnabled ? true : false}
                  />
                </View>
                <View style={[styles.profileDetailView, styles.settingCard]}>
                  <View style={styles.settingInnerView}>
                    <SimpleLineIcons
                      name={"music-tone-alt"}
                      size={20}
                      color={"grey"}
                    />
                    <Text style={styles.SettingInner}>
                      Play Conversation Tone
                    </Text>
                  </View>

                  <Switch
                    trackColor={{ false: "lightgrey", true: "green" }}
                    thumbColor={this.state.isEnabled ? "green" : "lightgrey"}
                    ios_backgroundColor="lightgrey"
                    onValueChange={() =>
                      this.toggleSwitch(this.state.isEnabled)
                    }
                    value={this.state.isEnabled ? true : false}
                  />
                </View>
                <View style={[styles.profileDetailView, styles.settingCard]}>
                  <View style={styles.settingInnerView}>
                    <MaterialIcons
                      name={"favorite-border"}
                      size={20}
                      color={"grey"}
                    />
                    <Text style={styles.SettingInner}>Favourite</Text>
                  </View>
                  <Switch
                    trackColor={{ false: "lightgrey", true: "green" }}
                    thumbColor={this.state.isFavourite ? "green" : "lightgrey"}
                    ios_backgroundColor="lightgrey"
                    onValueChange={() =>
                      this.favToggleSwitch(this.state.isFavourite)
                    }
                    value={this.state.isFavourite ? true : false}
                  />
                </View>
              </View>
            </ScrollView>
          </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatUserProfile);

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
    paddingVertical: 7,
  },
  rightIcon: {
    paddingHorizontal: 5,
  },
  headerview: {
    backgroundColor: "#008069",
  },
  mediaLinkText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: "grey",
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
    padding: 15,
    marginHorizontal: 5,
    // elevation: 5,
    flexDirection: "row",
    marginBottom: 1,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    borderRadius: 5,
  },
  personalDetailText: {
    fontSize: 18,
    fontFamily: "Roboto-Regular",
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
    fontFamily: "Roboto-Bold",
    color: "grey",
  },
  profileDetailName: {
    marginLeft: "20%",
    color: "grey",
  },
  SettingInner: {
    fontSize: 16,
    color: "grey",
    fontFamily: "Roboto-Bold",
    marginLeft: Dimensions.get("window").width * 0.05,
  },
  EditButton: {
    backgroundColor: "#008069",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 30,
  },
  container1: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  profileView: {
    width: 35,
    height: 35,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileImageUser: {
    width: 30,
    height: 30,
    borderRadius: 29,
  },
  infoView1: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: -10,
    height: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: "lightgrey",
  },
  settingCard: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingInnerView: { alignItems: "center", flexDirection: "row" },
});
