import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import moment from "moment";

//Redux
import { setAuthUser, setStickers } from "../../store/actions";
import { connect } from "react-redux";

//Services
import ChatServices from "../../services/ChatServices";
import {
  MessagesQuieries,
  ChatUsersQuieries,
} from "../../database/services/Services";
//Component
import MessageActionHeader from "../../components/headers/MessageActionHeader";
import MessageBubble from "../../components/MessageBubble";
import NoItemCard from "../../components/NoItemCard";

class StarredList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ApiLoader: true,
      starredList: [],
    };
  }

  componentDidMount = () => {
    if (this.props.route.params?.userData === "singleUserData") {
      this.getAllMsgsFromDb();
    } else {
      let token = this.props.user?.token;
      ChatServices.starredList(token).then((res) => {
        this.setState({ starredList: res?.data?.data?.chats });
      });
    }
  };

  getAllMsgsFromDb = () => {
    let onlineUserId = this.props.user?.user.id;
    let chatUserId = 0;
    if (this.props?.route?.params?.selectedUser?.user_id === undefined) {
      chatUserId = this.props?.route?.params.selectedUser.id;
    } else {
      chatUserId = this.props?.route?.params.selectedUser.user_id;
    }
    let mystar = "1";
    MessagesQuieries.selectDbSingleListmessage(
      { onlineUserId, chatUserId, mystar },
      (res2) => {
        this.setState({ starredList: res2 });
        // this.setMessageAsGifted(res2, true);
      }
    );
  };

  render() {
    const { theme, navigation } = this.props;
    return (
      <View style={styles.container}>
        <MessageActionHeader navProps={this.props} screen="StarredList" />
        {this.state.starredList && this.state.starredList.length > 0 ? (
          <ScrollView style={styles.starredMainView}>
            {this.state.starredList?.map((messages) => {
              return (
                <>
                  <View style={styles.starredInnerView}>
                    <View style={styles.senderNameAndReceiverView}>
                      <Image
                        source={require("../../assets/deafultimage.png")}
                        style={styles.senderReciverImage}
                      />
                      <Text style={styles.senderRevicerText}>
                        {messages?.first_name + " " + messages?.last_name}
                      </Text>
                      <View style={styles.Icon}>
                        <FontAwesome name={"play"} size={5} color={"white"} />
                      </View>
                      {this.props?.route?.params?.selectedUser?.chat_name ===
                      undefined ? (
                        <Text style={styles.youText}>
                          {messages?.to_user_firstname +
                            " " +
                            messages?.to_user_lastname}
                        </Text>
                      ) : messages?.first_name ==
                        this.props.user.user.first_name ? (
                        <Text style={styles.youText}>
                          {this.props?.route?.params?.selectedUser?.chat_name}
                        </Text>
                      ) : (
                        <Text style={styles.youText}>
                          {this.props?.user?.user?.first_name +
                            " " +
                            this.props?.user?.user?.last_name}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.youText}>
                      {moment(messages?.starred_at).format("MMM Do YY")}
                    </Text>
                  </View>
                  <View style={styles.starredMessage}>
                    <MessageBubble
                      starredList={true}
                      currentMessage={messages}
                    />
                    <View style={styles.starAndTime}>
                      <FontAwesome5
                        name={"star"}
                        size={10}
                        color={"black"}
                        style={styles.starIcon}
                      />
                      <Text style={styles.starredMessagetime}>
                        {moment(messages?.starred_at).format("LT")}
                      </Text>
                    </View>
                  </View>
                </>
              );
            })}
          </ScrollView>
        ) : (
          <NoItemCard
            icon="star"
            msg="Tap and hold on any message in any chat to star it, so you can
          easliy find it later."
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
    onSetStickers: (stickers) => {
      dispatch(setStickers(stickers));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StarredList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dbdbdb",
  },
  header: {
    justifyContent: "space-between",
    marginTop: "2%",
    backgroundColor: "#008069",
  },
  starredMainView: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.2)",
    margin: 5,
    marginTop: 10,
  },
  starredInnerView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  senderNameAndReceiverView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  senderReciverImage: {
    width: 20,
    height: 20,
  },
  senderRevicerText: {
    marginHorizontal: 5,
    color: "grey",
    fontWeight: "500",
  },
  Icon: {
    backgroundColor: "skyblue",
    padding: 2,
  },
  youText: {
    marginHorizontal: 5,
    color: "grey",
    fontWeight: "500",
  },
  starredMessage: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    marginVertical: "4%",
    padding: 5,
    minWidth: 80,
    borderRadius: 5,
    marginLeft: "2%",
  },
  starAndTime: {
    flexDirection: "row",
    paddingTop: 3,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  starIcon: {
    marginHorizontal: 5,
    marginTop: 2,
  },
  starredMessageText: {
    fontSize: 12,
  },
  starredMessagetime: {
    fontSize: 10,
  },
});
