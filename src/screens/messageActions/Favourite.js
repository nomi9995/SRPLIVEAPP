import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import FastImage from "react-native-fast-image";
import moment from "moment";

//Redux
import { setAuthUser, setStickers } from "../../store/actions";
import { connect } from "react-redux";

//Services
import ChatServices from "../../services/ChatServices";
import appConfig from "../../utils/appConfig";
//Component
import MessageActionHeader from "../../components/headers/MessageActionHeader";
import LastMessageType from "../../components/LastMessageType";
import NoItemCard from "../../components/NoItemCard";

class Favourite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ApiLoader: true,
      starredList: [],
      chatList: [],
      ageNum: 1,
      loading: false,
    };
  }
  componentDidMount = () => {
    let user_list_section = "favs";
    let page = this.state.pageNum;
    let token = this.props.user?.token;
    ChatServices.getUserList({ user_list_section, page }, token).then((res) => {
      if (page > 1) {
        let arr1 = this.state.chatList;
        let arr3 = [...arr1, ...res.data.data.chat_list];
        this.setState({ chatList: arr3, ApiLoader: false, loading: false });
      } else {
        this.setState({
          chatList: res.data.data.chat_list,
          ApiLoader: false,
          loading: false,
        });
      }
    });
  };
  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  enablePaggination = () => {
    this.setState({ pageNum: this.state.pageNum + 1 });
    this.setState({ loading: true });
    this.getUserList();
  };

  render() {
    const { theme, navigation } = this.props;

    return (
      <View style={styles.container}>
        <MessageActionHeader navProps={this.props} screen="Favourite" />
        {this.state.chatList && this.state.chatList.length > 0 ? (
          <ScrollView
            onScroll={({ nativeEvent }) => {
              if (this.isCloseToBottom(nativeEvent)) {
                this.enablePaggination();
              }
            }}
          >
            {this.state.chatList?.map((res, index) => {
              return (
                <>
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      this.props.navigation.navigate("MessageScreen", {
                        selectedUser: res,
                      })
                    }
                  >
                    <View style={styles.listCard}>
                      <View style={styles.flexDirec}>
                        {res.avatar === null ? (
                          <FastImage
                            source={require("../../assets/deafultimage.png")}
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
                      <View style={styles.timeAndreadCount}>
                        <Text style={styles.timeText}>
                          {moment
                            .utc(res.last_message_time)
                            .local("tr")
                            .fromNow()}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.borderLine}></View>
                  </TouchableOpacity>
                </>
              );
            })}
          </ScrollView>
        ) : (
          <NoItemCard icon="heart" msg="You have no favourite chat." />
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Favourite);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    justifyContent: "space-between",
    marginTop: "2%",
    backgroundColor: "#008069",
  },
  flexDirec: {
    flexDirection: "row",
    alignItems: "center",
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 54,
    marginTop: "2%",
    marginHorizontal: "2%",
  },
  profileImage: {
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
    marginLeft: "2%",
  },
  listContentView: {
    marginLeft: "10%",
  },
  nameText: {
    fontSize: 16,
    color: "#121b24",
    marginBottom: "5%",
    fontWeight: "400",
  },
  timeText: {
    marginRight: "8%",
    color: "#121b24",
    fontSize: 10,
  },
  borderLine: {
    borderWidth: Platform.OS == "android" ? 0.2 : 0.5,
    borderColor: "lightgrey",
    width: "83%",
    alignSelf: "flex-end",
    marginRight: "2%",
  },
  timeAndreadCount: {
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
});
