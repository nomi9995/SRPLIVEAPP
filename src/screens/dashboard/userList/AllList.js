import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
  TextInput,
  BackHandler,
} from "react-native";
import FastImage from "react-native-fast-image";
import ChatServices from "../../../services/ChatServices";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import { MessagesQuieries } from "../../../database/services/Services";

//Component
import HomeHeader from "../../../components/HomeHeader";
import UserSearchList from "./UserSearchList";

//Redux
import {
  setSearchQuery,
  setSearchState,
  setSearchShow,
} from "../../../store/actions";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

class AllList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      userList: [],
      searchStatus: false,
      loader: true,
      searchList: false,
      searchQueryUSerList: "",
      searchUserList: [],
      messageUserList: null,
    };
  }

  componentDidMount = () => {
    this.getUserData();
    BackHandler.addEventListener("hardwareBackPress", this.hardwareBack);
  };

  hardwareBack = () => {
    this.props.navigation.goBack();
    return true;
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener("hardwareBackPress", this.hardwareBack);
  };

  getUserData = () => {
    let user_list_section = "all";
    let page = this.state.pageNum;
    let token = this.props.user?.token;
    ChatServices.getUserList({ user_list_section, page }, token).then((res) => {
      this.setState({ loader: false });
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
          let arr1 = this.state.userList;
          let arr3 = [...arr1, ...res.data.data.departments];
          this.setState({
            userList: arr3,
          });
        } else {
          this.setState({
            userList: res.data.data.departments,
          });
        }
      }
    });
  };

  onPressGroupBtn = () => {
    this.props.onSetSearchShow(false);
    this.props.onSetSearchState(false);
    this.props.onSetSearchQuery("");
    this.props.navigation.navigate("GroupList");
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  searcUSerListFun = async (text) => {
    await this.setState({ searchQueryUSerList: text });
    if (this.props?.searchQueryUSerList === "") {
      this.setState({ searchUserList: [] });
      this.setState({ searchMessageList: [] });
    } else if (this.state.searchQueryUSerList.length >= 5) {
      let text = this.state.searchQueryUSerList;
      let onlineUser = this.props.user.user.id;
      MessagesQuieries.searchMsgAndUserListDb({ onlineUser, text }, (res) => {
        if (res.length === 0) {
          this.setState({ messageUserList: "No User Found" });
        } else {
          this.setState({ messageUserList: null });
        }
        this.setState({ searchUserList: res });
      });
    } else if (this.state.searchQueryUSerList.length < 5) {
      this.setState({ searchUserList: [] });
      this.setState({ searchMessageList: [] });
    }
  };

  render() {
    const { userList, searchList, searchUserList, messageUserList, loader } =
      this.state;
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ backgroundColor: "#008069" }}>
          {searchList ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 20,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    searchList: false,
                    searchQueryUSerList: "",
                    searchUserList: [],
                  })
                }
                style={{ paddingHorizontal: "2%" }}
              >
                <FontAwesome name={"arrow-left"} size={20} color={"white"} />
              </TouchableOpacity>
              <TextInput
                autoFocus={true}
                style={styles.searchTextInput}
                placeholder="Search"
                placeholderTextColor="white"
                value={this.state.searchQueryUSerList}
                selectionColor="white"
                onChangeText={(text) => this.searcUSerListFun(text)}
              />
            </View>
          ) : (
            <View style={styles.headerView}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}
                style={{ paddingHorizontal: "2%" }}
              >
                <FontAwesome name={"arrow-left"} size={20} color={"white"} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.settingText,
                  { paddingHorizontal: "2%", marginRight: "3%" },
                ]}
                onPress={() => this.setState({ searchList: true })}
              >
                <FontAwesome name={"search"} size={20} color={"white"} />
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
        {searchList ? (
          <UserSearchList
            navProps={this.props}
            searchuserlistCom={searchUserList}
            messageUserList={messageUserList}
            callBackToState={(data) => this.setState({ searchList: false })}
          />
        ) : (
          <>
            {loader ? (
              <View style={styles.loader}>
                <ActivityIndicator
                  size="large"
                  color="green"
                  // style={styles.loader}
                />
              </View>
            ) : (
              <>
                <ScrollView
                  onScroll={({ nativeEvent }) => {
                    if (this.isCloseToBottom(nativeEvent)) {
                      this.setState({ pageNum: ++this.state.pageNum });
                      this.getUserData();
                    }
                  }}
                  scrollEventThrottle={400}
                >
                  <TouchableOpacity
                    style={styles.GroupButton}
                    onPress={this.onPressGroupBtn}
                  >
                    <FastImage
                      source={require("../../../assets/deafultimage.png")}
                      style={[styles.profileImage, { width: 60, height: 60 }]}
                    />
                    <Text style={styles.groupText}>Groups</Text>
                  </TouchableOpacity>

                  <>
                    {userList.map((res) => {
                      return (
                        <>
                          <Text style={styles.groupName}>{res.name}</Text>
                          {res.users.map((res, index) => {
                            res.is_room = 0;
                            return (
                              <TouchableOpacity
                                key={index}
                                onPress={() =>
                                  this.props.navigation.navigate(
                                    "MessageScreen",
                                    {
                                      selectedUser: res,
                                    }
                                  )
                                }
                              >
                                <View style={styles.listCard}>
                                  <View style={styles.flexDirec}>
                                    {res.avatar_url == "" ? (
                                      <FastImage
                                        source={require("../../../assets/deafultimage.png")}
                                        style={styles.profileImage}
                                      />
                                    ) : (
                                      <FastImage
                                        source={{ uri: res.avatar_url }}
                                        style={styles.profileImage}
                                      />
                                    )}
                                    <View style={styles.listContentView}>
                                      <Text
                                        style={styles.nameText}
                                        numberOfLines={1}
                                      >
                                        {res.first_name + res.last_name}
                                      </Text>
                                    </View>
                                  </View>
                                  <View style={styles.phoneAndIconView}>
                                    <TouchableOpacity style={{ padding: 5 }}>
                                      <FontAwesome
                                        name={"phone"}
                                        size={16}
                                        color={"#008069"}
                                      />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ padding: 5 }}>
                                      <FontAwesome
                                        name={"video"}
                                        size={16}
                                        color={"#008069"}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                <View style={styles.borderLine}></View>
                              </TouchableOpacity>
                            );
                          })}
                        </>
                      );
                    })}
                  </>
                </ScrollView>
              </>
            )}
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
    searchState: state.stateHandler.searchState,
    searchShow: state.stateHandler.searchShow,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetSearchQuery: (data) => {
      dispatch(setSearchQuery(data));
    },
    onSetSearchState: (data) => {
      dispatch(setSearchState(data));
    },
    onSetSearchShow: (data) => {
      dispatch(setSearchShow(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllList);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  flexDirec: {
    flexDirection: "row",
    alignItems: "center",
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    marginLeft: "2%",
  },
  profileImage: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    marginLeft: "2%",
  },
  listContentView: {},
  nameText: {
    fontSize: 14,
    color: "#121b24",
    width: "90%",
    marginLeft: 20,
    fontFamily: "Roboto-Regular",
  },
  borderLine: {
    borderWidth: Platform.OS == "android" ? 0.2 : 0.5,
    borderColor: "lightgrey",
    width: "80%",
    alignSelf: "flex-end",
    marginRight: "2%",
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  phoneAndIconView: {
    flexDirection: "row",
    marginRight: "5%",
    width: 80,
    justifyContent: "space-between",
  },
  GroupButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: "70%",
  },
  groupText: {
    marginLeft: "5%",
    fontSize: 16,
    color: "black",
    fontFamily: "Roboto-Medium",
  },
  groupName: {
    marginLeft: "2%",
    color: "#008069",
    marginTop: 20,
    fontFamily: "Roboto-Medium",
  },
  headerView: {
    backgroundColor: "#008069",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  searchTextInput: {
    width: "80%",
    color: "white",
  },
});
