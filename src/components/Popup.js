import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

import { W_WIDTH } from "../utils/regex";
import Feather from "react-native-vector-icons/dist/Feather";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5";
import Icon from "react-native-vector-icons/dist/MaterialCommunityIcons";

// Icons
import RemindLaterIcon from "../assets/popup_icons/alert-5px-02.svg";

//Redux
import {
  setOnLongPress,
  setReplyState,
  setSickerOpen,
  setMediaOptionsOpen,
  setSearchQuery,
  setSearchState,
} from "../store/actions";
import { connect } from "react-redux";

//Component
import FilterModal from "./Modal/FilterModal";

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: 0,
      filtermodal: false,
    };
  }
  AcknowledgementMessage = (data) => {
    const { navigation } = this.props.navProps.navProps;
    this.props.callClose();
    navigation.navigate("AcknowledgementMessage", {
      userData: data,
      selectedUser: this.props.navProps.selectedUser,
    });
  };

  StarredList = (data) => {
    const { navigation } = this.props.navProps.navProps;
    this.props.callClose();
    navigation.navigate("StarredList", {
      userData: data,
      selectedUser: this.props.navProps.selectedUser,
    });
  };

  RespondLater = (data) => {
    const { navigation } = this.props.navProps.navProps;
    this.props.callClose();
    navigation.navigate("RespondLater", {
      userData: data,
      selectedUser: this.props.navProps?.selectedUser,
    });
  };

  NotificationList = () => {
    const { navigation } = this.props.navProps.navProps;
    this.props.callClose();
    navigation.navigate("NotificationList");
  };

  Favourite = () => {
    const { navigation } = this.props.navProps.navProps;
    this.props.callClose();
    navigation.navigate("Favourite");
  };

  Settings = () => {
    const { navigation } = this.props.navProps.navProps;
    this.props.callClose();
    navigation.navigate("Profile");
  };

  ProfileChange = () => {
    this.props.onSetMediaOptionsOpen(false);
    this.props.onSetSickerOpen(false);
    this.props.callClose();
    this.props.navProps.navProps.navigation.navigate("ChatUserProfile", {
      userProfiledata: this.props.navProps.selectedUser,
    });
  };

  render() {
    const { currentIndex } = this.state;

    return (
      <View style={{ width: W_WIDTH / 1.75, backgroundColor: "white" }}>
        {this.props.navProps.screen === "message" ? (
          <>
            <View>
              <TouchableOpacity
                style={styles.popButton}
                onPress={() => {
                  this.props.searchShow();
                  this.props.callClose();
                }}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome5 name="search" size={20} color="#c2c2c2" />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.popTitleText} numberOfLines={1}>
                    Search
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popButton}
                onPress={() => this.setState({ filtermodal: true })}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome5 name="sliders-h" size={20} color="#c2c2c2" />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.popTitleText} numberOfLines={1}>
                    Filter
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.popButton}
                onPress={() => this.AcknowledgementMessage("singleUserData")}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome5 name="hand-pointer" size={22} color="#c2c2c2" />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.popTitleText} numberOfLines={1}>
                    Acknowledgement
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.popButton}
                onPress={() => this.StarredList("singleUserData")}
              >
                <View style={styles.iconContainer}>
                  <Icon name="flag-triangle" size={24} color="#c2c2c2" />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.popTitleText} numberOfLines={1}>
                    Starred Messages
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.popButton}
                onPress={() => this.RespondLater("singleUserData")}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome5 name="history" size={19} color="#c2c2c2" />
                </View>

                {/* <RemindLaterIcon /> */}
                <View style={styles.textContainer}>
                  <Text style={styles.popTitleText}>Respond Later</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.popButton}>
                <View style={styles.iconContainer}>
                  <Ionicons name="alarm-outline" size={26} color="#c2c2c2" />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.popTitleText}>Remind Me</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.popButton}
              onPress={() => this.ProfileChange()}
            >
              <View style={styles.iconContainer}>
                <FontAwesome5 name="user-circle" size={21} color="#c2c2c2" />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.popTitleText}>View Profile</Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.popButton}>
              <View style={styles.iconContainer}>
                <Feather name="heart" size={22} color="#c2c2c2" />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.popTitleText}>Add to Favorites</Text>
              </View>
            </TouchableOpacity> */}
          </>
        ) : (
          <>
            <View>
              <TouchableOpacity
                style={styles.popButton}
                onPress={() => this.AcknowledgementMessage()}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome5 name="hand-pointer" size={22} color="#c2c2c2" />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.popTitleText} numberOfLines={1}>
                    Acknowledgement
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.popButton}
                onPress={() => this.StarredList()}
              >
                <View style={styles.iconContainer}>
                  <Icon name="flag-triangle" size={24} color="#c2c2c2" />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.popTitleText} numberOfLines={1}>
                    Starred Messages
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.popButton}
                onPress={() => this.RespondLater()}
              >
                <View style={styles.iconContainer}>
                  <FontAwesome5 name="history" size={19} color="#c2c2c2" />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.popTitleText}>Respond Later</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.popButton}
                onPress={() => this.NotificationList()}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="alarm-outline" size={26} color="#c2c2c2" />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.popTitleText} numberOfLines={1}>
                    Notification List
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.popButton}
              onPress={() => this.Favourite()}
            >
              <View style={styles.iconContainer}>
                <FontAwesome5 name="heart" size={22} color="#c2c2c2" />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.popTitleText}>Favorites</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.popButton}
              onPress={() => this.Settings()}
            >
              <View style={styles.iconContainer}>
                <Feather name="settings" size={22} color="#c2c2c2" />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.popTitleText}>Settings</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
        {this.state.filtermodal ? (
          <FilterModal
            visible={this.state.filtermodal}
            selectedUser={this.props.navProps.selectedUser}
            closeModal={(data) => this.setState({ filtermodal: data })}
            filterMessageData={(data) => this.props.filterData(data)}
          />
        ) : null}
      </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    longPress: state.messages.longPress,
    replyState: state.stateHandler.replyState,
    mediaOptionsOpen: state.stateHandler.mediaOptionsOpen,
    stickerOpen: state.stateHandler.stickerOpen,
    searchQuery: state.stateHandler.searchQuery,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetOnLongPress: (data) => {
      dispatch(setOnLongPress(data));
    },
    onSetReplyState: (data) => {
      dispatch(setReplyState(data));
    },
    onSetSickerOpen: (data) => {
      dispatch(setSickerOpen(data));
    },
    onSetMediaOptionsOpen: (data) => {
      dispatch(setMediaOptionsOpen(data));
    },
    onSetSearchQuery: (data) => {
      dispatch(setSearchQuery(data));
    },
    onSetSearchState: (data) => {
      dispatch(setSearchState(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Popup);

const styles = StyleSheet.create({
  popButton: {
    paddingHorizontal: 0,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginVertical: 1,
  },

  iconContainer: {
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },

  textContainer: {
    flex: 0.8,
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 3,
  },

  popTitleText: {
    // fontFamily: AppFonts.RobotoRegular,
    fontSize: 16,
    fontWeight: "600",
    textAlignVertical: "center",
    color: "grey",
    fontFamily: "Roboto-Regular",
  },
});
