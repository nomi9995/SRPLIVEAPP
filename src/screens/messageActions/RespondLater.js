import React, { Component } from "react";
import { View, StyleSheet, Text, ScrollView, Image } from "react-native";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
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

class RespondLater extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ApiLoader: true,
      reponselater: [],
    };
  }

  componentDidMount = () => {
    if (this.props.route.params?.userData === "singleUserData") {
      this.getAllMsgsFromDb();
    } else {
      let token = this.props.user?.token;
      ChatServices.reponselater(token).then((res) => {
        this.setState({ reponselater: res?.data?.data?.chats });
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
    let respondLater = "1";
    MessagesQuieries.selectDbSingleListmessageReppondLater(
      { onlineUserId, chatUserId, respondLater },
      (res2) => {
        this.setState({ reponselater: res2 });
        // this.setMessageAsGifted(res2, true);
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <MessageActionHeader navProps={this.props} screen="RespondLater" />
        <ScrollView style={styles.responseMainView}>
          {this.state.reponselater?.map((messages) => {
            return (
              <>
                <View style={styles.responseInnerView}>
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
                    {/* <Text style={styles.youText}>{messages?.to_user_firstname+' ' +messages?.to_user_lastname}</Text> */}
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
                    {moment(messages?.time).format("MMM Do YY")}
                  </Text>
                </View>
                <View style={styles.responseMessage}>
                  <MessageBubble starredList={true} currentMessage={messages} />
                  <View style={styles.starAndTime}>
                    <FontAwesome
                      name={"clock"}
                      size={10}
                      color={"black"}
                      style={styles.starIcon}
                    />
                    <Text style={styles.responseMessagetime}>
                      {moment(messages?.time).format("LT")}
                    </Text>
                  </View>
                </View>
              </>
            );
          })}
        </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(RespondLater);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dbdbdb",
  },
  cardDesign: {
    padding: "5%",
  },
  Loader_container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 700,
  },
  header: {
    justifyContent: "space-between",
    marginTop: "2%",
    backgroundColor: "#008069",
  },
  responseMainView: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.2)",
    margin: 5,
    marginTop: 10,
  },
  responseInnerView: {
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
  responseMessage: {
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
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  starIcon: {
    marginHorizontal: 5,
    marginTop: 2,
  },
  responseMessageText: {
    fontSize: 12,
  },
  responseMessagetime: {
    fontSize: 10,
  },
});
