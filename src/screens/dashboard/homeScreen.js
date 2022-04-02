import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  PermissionsAndroid,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

//Components
import HomeHeader from "../../components/HomeHeader";
import RecentList from "./userList/RecentList";
import SearchList from "./userList/SearchList";
import StoryTabs from "./storyTab/StoryTabs";
import CallTab from "./calltab/CallTab";
import MediaUpload from "../../components/MediaUpload";

//Service
import ChatServices from "../../services/ChatServices";

//DataBase
import { MessagesQuieries } from "../../database/services/Services";

//Redux
import { setStatusState, setMediaType } from "../../store/actions";
import { connect } from "react-redux";

class homeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: "first", title: "CHATS" },
        { key: "second", title: "STATUS" },
      ],
    };
  }

  componentDidMount = async () => {
    this.getAllUpdatedMessages();
    try {
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      if (
        grants["android.permission.CAMERA"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants["android.permission.READ_EXTERNAL_STORAGE"] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants["android.permission.RECORD_AUDIO"] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };

  getAllUpdatedMessages = () => {
    let payload = {
      after: this.props.appCloseTime,
    };
    let token = this.props.user?.token;
    ChatServices.updatedMessages(payload, token).then((res) => {
      let tableName = "messages_list_table";
      let resp = res;
      let onlineUserId = this.props.user?.user.id;
      MessagesQuieries.insertAndUpdateMessageList(
        { tableName, resp, onlineUserId },
        (res3) => {}
      );
    });
  };

  onBottomButtonPress = () => {
    const { index } = this.state;
    if (index === 1) {
      this.props.onSetStatus(true);
      this.props.onSetMediaType("camera");
    } else if (index === 0) {
      this.props.navigation.navigate("AllList");
    }
  };

  FirstRoute = () => <RecentList navProps={this.props} />;

  SecondRoute = () => <StoryTabs navProps={this.props} />;

  renderScene = SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute,
  });

  renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: "#008069" }}
    />
  );

  render() {
    const { index, routes } = this.state;

    let name = "comment-alt";
    if (index === 1) name = "camera";
    else name = "comment-alt";

    return (
      <>
        {this.props.reloader ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Image
              source={require("../../assets/srp.png")}
              style={{ height: 100, width: 230, marginBottom: "20%" }}
            />
            <ActivityIndicator size={"large"} color={"green"} />
            <View>
              <Text style={{ color: "gray" }}>
                Please Wait while fetching data for you
              </Text>
            </View>
          </View>
        ) : (
          <>
            {this.props.statusState === true ? (
              <MediaUpload onBack={() => this.setState({ index: 1 })} />
            ) : (
              <>
                <HomeHeader
                  screen="home"
                  navProps={this.props}
                  userData={this.props?.user?.user}
                  optionPress={this.openPopover}
                  chatUserOnlineStatus={null}
                  typingStatus={false}
                />
                {this.props.searchState && this.props.searchShow ? (
                  <SearchList navProps={this.props} />
                ) : !this.props.searchState && !this.props.searchShow ? (
                  <View style={styles.container}>
                    <TabView
                      navigationState={{ index, routes }}
                      renderTabBar={this.renderTabBar}
                      renderScene={this.renderScene}
                      onIndexChange={(data) => {
                        this.setState({ index: data });
                      }}
                      initialLayout={{ width: Dimensions.get("window").width }}
                    />
                  </View>
                ) : null}
                <TouchableOpacity
                  style={styles.editButtonPosition}
                  onPress={() => this.onBottomButtonPress()}
                >
                  <View style={styles.editButton}>
                    <FontAwesome5 name={name} size={27} color={"white"} />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    theme: state.auth.theme,
    user: state.auth.user,
    appCloseTime: state.stickers.appCloseTime,
    searchState: state.stateHandler.searchState,
    statusState: state.stateHandler.statusState,
    reloader: state.stateHandler.setreloader,
    searchShow: state.stateHandler.searchShow,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetStatus: (data) => {
      dispatch(setStatusState(data));
    },

    onSetMediaType: (data) => {
      dispatch(setMediaType(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(homeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  editButton: {
    width: 62,
    height: 62,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#008069",
  },

  editButtonPosition: {
    position: "absolute",
    bottom: 35,
    right: 10,
    zIndex: 1,
  },
});
