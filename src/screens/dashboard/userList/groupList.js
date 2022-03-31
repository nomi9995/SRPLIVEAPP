import React, { Component } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, ActivityIndicator, Alert } from "react-native";

import { connect } from "react-redux";
import AppFonts from "../../../assets/fonts";
import appConfig from '../../../utils/appConfig';
import ChatServices from '../../../services/ChatServices';
import FontAwesome from "react-native-vector-icons/dist/FontAwesome";

// Components
import HomeHeader from '../../../components/HomeHeader';
import SearchList from './SearchList';

class groupList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNum: 1,
      loader: true,
      groupsList: [],

      search: '',
      searchTyping: false,
      searchResponse: null,
      typingTimeout: 0,
      searchStatus: false,
    };
  }

  componentDidMount = () => {
    this.getUserData();
  };

  getUserData = () => {
    let user_list_section = 'groups';
    let page = this.state.pageNum;
    let token = this.props.user?.token;
    ChatServices.getUserList({ user_list_section, page }, token).then(res => {
      this.setState({ loader: false });
      if (res.data.errors == 'Unauthorized') {
        Alert.alert(
          'Unauthorized',
          'This user is already logged in on another device.',
          [
            {
              text: 'OK',
              onPress: () => {
                this.props.onSetAuthUser(null);
                this.props.navigation.replace('LoginScreen');
              },
            },
          ],
        );
      } else {
        if (page > 1) {
          let arr1 = this.state.groupsList;
          let arr3 = [...arr1, ...res.data.data.groups];
          this.setState({
            groupsList: arr3,
          });
        } else {
          this.setState({
            groupsList: res.data.data.groups,
          });
        }
      }
    });
  };

  backButton = () => {
    this.props.navigation.goBack()
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  render() {
    const { theme, navigation } = this.props;
    return (
      <>
        <HomeHeader
          screen={'groupList'}
          navProps={this.props}
          backPress={this.backButton}
        />
        {
          this.state.loader ?
            <View style={styles.noGroupContainer}>
              <ActivityIndicator size="large" color="green" />
            </View>
            : this.state.groupsList.length === 0 ?
              <View style={styles.noGroupContainer}>
                <Text style={styles.noGroupText}>No Groups Joined</Text>
              </View>
              :
              <ScrollView
              // onScroll={({nativeEvent}) => {
              //   if (this.isCloseToBottom(nativeEvent)) {
              //     this.setState({pageNum: ++this.state.pageNum})
              //     this.getUserData()
              //   }
              // }}
              // scrollEventThrottle={400}
              >
                {
                  this.props.searchState ?
                    <SearchList navProps={this.props} />
                    :
                    this.state.groupsList.map((item, index) => {
                      item.is_room = 1
                      return (
                        <>
                          <TouchableOpacity
                            key={index}
                            style={styles.groupChatView}
                            onPress={() =>
                              navigation.push("MessageScreen", {
                                selectedUser: item,
                                chatList: "group",
                              })
                            }
                          >
                            {item.cover_image === null ? (
                              <Image
                                source={require("../../../assets/group.png")}
                                style={{ width: 40, height: 40 }}
                              />
                            ) : (
                              <Image
                                source={{ uri: appConfig.avatarPath + item.cover_image }}
                                style={{ width: 40, height: 40, borderRadius: 30 }}
                              />
                            )}
                            <View style={styles.groupChatText}>
                              <Text
                                numberOfLines={1}
                                style={styles.groupChatTextGroupName}
                              >
                                {item.name}
                              </Text>
                              <View style={styles.groupChatMeassge}>
                                <FontAwesome
                                  name={"users"}
                                  size={12}
                                  color={"grey"}
                                  style={{ marginTop: "1%", marginRight: "3%" }}
                                />
                                <Text
                                  numberOfLines={2}
                                  style={{
                                    fontFamily: AppFonts.HelveticaNeueLTStdLt,
                                    fontSize: 12,
                                    color: 'black'
                                  }}
                                >
                                  {item.users_count}
                                </Text>
                              </View>
                            </View>
                            <View style={{ flex: 1, alignItems: "flex-end" }}>
                              {item.unread_count > 0 && (
                                <View
                                  style={[
                                    styles.unreadCountView,
                                    {
                                      backgroundColor: theme.onlineColor,
                                      borderColor: theme.container.backgroundColor,
                                    },
                                  ]}
                                >
                                  {item.unread_count > 99 ? (
                                    <Text style={styles.unreadCountTextSatic}>
                                      99+
                                    </Text>
                                  ) : (
                                    <Text style={styles.unreadCountText}>
                                      {item.unread_count}
                                    </Text>
                                  )}
                                </View>
                              )}
                            </View>
                          </TouchableOpacity>
                          <View style={styles.bottomLine}></View>
                        </>
                      )
                    })
                }
              </ScrollView>
        }
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme,
    user: state.auth.user,
    searchState: state.stateHandler.searchState
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(groupList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  groupChatView: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginHorizontal: "2%",
    paddingVertical: "3%",
    alignItems: "center",
    //  backgroundColor:'red'
  },
  groupChatText: {
    width: "65%",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: "5%",
    // backgroundColor:'blue'
  },
  groupChatTextGroupName: {
    fontFamily: "Roboto-Medium",
    fontSize: 18,
    marginBottom: "2%",
    color: 'black'
  },
  groupChatMeassge: {
    flexDirection: "row",
  },
  bottomLine: {
    borderWidth: 0.5,
    borderColor: "lightgrey",
    marginLeft: "15%",
  },
  unreadCountView: {
    width: 20,
    height: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red",
  },
  unreadCountTextSatic: {
    fontFamily: AppFonts.HelveticaNeueLTStdLtBold,
    fontSize: 10,
    color: "white",
  },
  unreadCountText: {
    fontFamily: AppFonts.HelveticaNeueLTStdLtBold,
    fontSize: 12,
    color: "white",
  },

  noGroupContainer: {
    flex: 1,
    alignItem: 'center',
    justifyContent: 'center',
  },

  noGroupText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black'
  }
});
