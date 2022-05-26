import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import FastImage from "react-native-fast-image";
import { connect } from "react-redux";
import ChatServices from "../../../services/ChatServices";
import appConfig from "../../../utils/appConfig";
import { socket } from "../../../sockets/connection";
// import moment from 'moment';
import moment from "moment-timezone";
import { TouchableOpacity } from "react-native-gesture-handler";
import { regex } from "../../../utils/regex";
import WebSockits from "../../../services/WebSockits";
import LocalTimeZone from "react-native-localize";

//Components
import LastMessageType from "../../../components/LastMessageType";

//DataBase
import {
  ChatUsersQuieries,
  MessagesQuieries,
} from "../../../database/services/Services";
//Redux
import { setRenderState, setAuthUser } from "../../../store/actions";

let offset = 0;
class RecentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      userList: [],
    };
  }

  componentDidMount = () => {
    offset = 0;
    this.getUSerDataDb();
    this.socketsRun();
  };
  componentWillUnmount = () => {
    this.subscribeToMessages?.unsubscribe?.();
  };

  getUSerDataDb = () => {
    let onlineUserId = this.props?.user?.user.id;
    ChatUsersQuieries.selectDb(offset, { onlineUserId }, (res) => {
      if (res === null) {
      } else if (res.length !== 0) {
        this.setState({ userList: res });
      }
      this.getUserData();
    });
  };

  dbdata = () => {
    let onlineUserId = this.props?.user?.user.id;
    ChatUsersQuieries.selectDb(offset, { onlineUserId }, (res) => {
      if (res === null) {
      } else if (res.length !== 0) {
        this.setState({ userList: res });
      }
    });
  };

  socketsRun = () => {
    socket.on("connect", () => {
      socket.emit(
        "new_user",
        JSON.stringify({ user_id: this.props.user?.user.id, device: "mobile" })
      );
    });
    socket.off("message_read");
    socket.emit("user_online_mobile", this.props.user?.user.id);
    socket.on("user_list_update_mobile", (data) => {
      var data = {};
      data["user_list_sec"] = "recent";
      data["current_user"] = this.props.user?.user.id;
      socket.emit("user_list", JSON.stringify(data));
      socket.on("user_list_change", (res) => {
        socket.off("user_list_change");
        ChatUsersQuieries.insertAndUpdateUserListonlogin(
          "users_list_table",
          res?.chat_list,
          this.props.user.user.id,
          (res) => {
            this.dbdata();
          }
        );

        // socket.off('user_list');
        // socket.off('user_list_change');
      });
    });

    this.subscribeToMessages = WebSockits.subscribeToMessages((msg) => {
      socket.emit(
        "new_user",
        JSON.stringify({ user_id: this.props.user?.user.id, device: "mobile" })
      );
      if (msg) {
        let message = regex.getMessages(
          msg.chat,
          msg.chat.sender_id,
          this.props.user?.user
        );
        // Save To DB Message
        let newMessageArray = {
          data: {
            data: [
              {
                chats: [message],
                is_room: message.is_room,
                room_id: message.is_room === 1 ? message.chatUser : null,
                user_id: message.is_room === 0 ? message.chatUser : null,
              },
            ],
          },
        };
        let tableName = "messages_list_table";
        let resp = newMessageArray;
        let onlineUserId = this.props.user?.user.id;
        MessagesQuieries.insertAndUpdateMessageList(
          { tableName, resp, onlineUserId },
          (res3) => {
            this.getUserData();
          }
        );
      }
    });
  };

  getUserData = () => {
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
                text: "Use Here",
                onPress: () => {
                  this.props.onSetAuthUser(null);
                  this.props.navProps.navigation.replace("LoginScreen");
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
                // this.getUSerDataDb();
                this.dbdata();
              }
            );
          }
        }
      }
    );
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  render() {
    if (this.props.renderstate) {
      this.props.onSetRenderState(false);
      this.getUSerDataDb();
      this.socketsRun();
    }
    const { userList } = this.state;
    return (
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (this.isCloseToBottom(nativeEvent)) {
            offset += 50;
            this.getUSerDataDb();
          }
        }}
        scrollEventThrottle={400}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {userList.map((res, index) => {
            let MessageTime = "";
            var m = moment.tz(res.last_message_time, "UTC").format();
            let f = moment.tz(m, LocalTimeZone.getTimeZone()).format();
            let currentMessageDate = f.split("T")[0];
            let todayDate = moment().format().split("T")[0];
            let yesterday = moment(f)
              .subtract("days")
              .calendar()
              .split(" at ")[0];
            if (todayDate == currentMessageDate) {
              MessageTime = moment(f).local().format("LT");
            } else {
              MessageTime = yesterday;
            }
            return (
              <TouchableOpacity
                key={index + res.last_message}
                onPress={() =>
                  this.props.navProps.navigation.replace("MessageScreen", {
                    selectedUser: res,
                  })
                }
              >
                <View style={styles.listCard}>
                  <View style={styles.flexDirec}>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      {res.avatar === null ? (
                        <FastImage
                          source={require("../../../assets/deafultimage.png")}
                          style={styles.profileImage}
                        />
                      ) : (
                        <FastImage
                          source={{ uri: appConfig.avatarPath + res.avatar }}
                          style={styles.profileImage}
                        />
                      )}
                      <View style={styles.listContentView}>
                        <Text style={styles.nameText}>{res.chat_name}</Text>
                        <LastMessageType lastMessage={res} />
                      </View>
                    </View>
                  </View>
                  <View style={styles.timeAndreadCount}>
                    <Text style={styles.timeText}>
                      {/* {moment(res.last_message_time).local().fromNow()} */}
                      {MessageTime}
                    </Text>
                    {res.unread_count > 0 && (
                      <View style={styles.countView}>
                        {res.unread_count > 99 ? (
                          <Text style={styles.unreadStatic}>99+</Text>
                        ) : (
                          <Text style={styles.unreadCount}>
                            {res.unread_count}
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.borderLine}></View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme,
    user: state.auth.user,
    scroll: state.stateHandler.scrollState,
    statusState: state.stateHandler.statusState,
    renderstate: state.stateHandler.renderstate,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetRenderState: (data) => {
      dispatch(setRenderState(data));
    },
    onSetAuthUser: (user) => {
      dispatch(setAuthUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RecentList);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  flexDirec: {
    flexDirection: "row",
    flex: 0.8,
  },
  listCard: {
    flex: 1,
    flexDirection: "row",
    paddingTop: "4%",
    justifyContent: "space-between",
    height: 85,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: "2%",
  },
  listContentView: {
    marginLeft: "5%",
    alignItems: "flex-start",
    flex: 1,
  },
  messageTypeText: {
    fontSize: 12,
    color: "grey",
  },
  timeText: {
    marginRight: "2%",
    color: "grey",
    fontSize: 12,
    fontFamily: "Roboto-Regular",
  },
  nameText: {
    fontSize: 17,
    color: "#121b24",
    marginTop: "-1.5%",
    marginBottom: "2%",
    fontFamily: "Roboto-Bold",
  },
  borderLine: {
    borderWidth: Platform.OS == "android" ? 0.2 : 0.7,
    borderColor: "#ebebeb",
    width: "80%",
    alignSelf: "flex-end",
    marginRight: "2%",
  },
  timeAndreadCount: {
    flex: 0.2,
    flexDirection: "column",
    alignItems: "center",
  },
  countView: {
    backgroundColor: "#008069",
    width: 25,
    height: 25,
    alignItems: "center",
    borderRadius: 30,
    marginVertical: 5,
    justifyContent: "center",
  },
  unreadStatic: {
    fontSize: 10,
    alignSelf: "center",
    color: "white",
  },
  unreadCount: {
    fontSize: 12,
    color: "white",
  },
});
