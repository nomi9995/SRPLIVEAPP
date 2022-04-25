import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TextInput,
  ScrollView,
} from "react-native";

//Redux
import {
  setSearchQuery,
  setSearchState,
  setSearchShow,
} from "../../../store/actions";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import { MessagesQuieries } from "../../../database/services/Services";
import FastImage from "react-native-fast-image";
import appConfig from "../../../utils/appConfig";
import moment from "moment";
import HighlightText from "@sanar/react-native-highlight-text";

let keywordsWithoutSpace = [];
class Searhlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQueryUSerList: "",
      searchUserList: [],
      searchMessageList: [],
    };
  }
  onSearchClick = (res, data) => {
    this.props.navigation.navigate("MessageScreen", {
      selectedUser: res,
      screen: data,
      keywords: keywordsWithoutSpace,
    });
    // mahmu
  };

  SearchUserAndMessage = async (text) => {
    await this.setState({ searchQueryUSerList: text });

    let q = text;
    if (q === "") {
      this.setState({ searchUserList: [] });
      this.setState({ searchMessageList: [] });
    } else if (q.length >= 4) {
      let text = q;
      let onlineUser = this.props.user.user.id;
      let keywords = text.split(" ");
      let subQuery = "";
      keywords.forEach((word) => {
        if (word !== "") {
          subQuery += `message LIKE '%${word}%' OR `;
          keywordsWithoutSpace.push(word);
        }
      });
      subQuery += `message LIKE '%${text}%'`;
      MessagesQuieries.searchMsgAndUserListDb(
        { onlineUser, text },
        async (res) => {
          await this.setState({ searchUserList: res });
          if (res.length === 0) {
            await this.setState({ showSearchUser: "Nothing Found" });
          } else {
            await this.setState({ showSearchUser: null });
          }
        }
      );
      MessagesQuieries.searchMsgListDb(
        { onlineUser, text, subQuery },
        async (res) => {
          await this.setState({ searchMessageList: res });
          if (res.length === 0) {
            await this.setState({ showSearchMessage: "Nothing Found" });
          } else {
            await this.setState({ showSearchMessage: null });
          }
        }
      );
    } else if (q.length < 4) {
      this.setState({ searchUserList: [] });
      this.setState({ searchMessageList: [] });
      await this.setState({ showSearchMessage: null, showSearchUser: null });
    }
  };

  render() {
    return (
      <>
        <SafeAreaView style={{ backgroundColor: "#008069" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
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
              onChangeText={(text) => this.SearchUserAndMessage(text)}
            />
          </View>
        </SafeAreaView>
        {this.state.showSearchMessage !== null &&
        this.state.showSearchUser !== null ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>Nothing Found</Text>
          </View>
        ) : (
          <>
            <ScrollView style={{ flexGrow: 1, backgroundColor: "white" }}>
              {this.state.searchUserList.length > 0 && (
                <View>
                  <Text style={styles.UserText}>Users</Text>
                  {this.state?.searchUserList?.map((res) => {
                    return (
                      <>
                        <TouchableOpacity
                          style={styles.userInnerView}
                          onPress={() => this.onSearchClick(res, "userData")}
                        >
                          {res.avatar === null ? (
                            <FastImage
                              source={require("../../../assets/deafultimage.png")}
                              style={styles.profileImage}
                            />
                          ) : (
                            <FastImage
                              source={{
                                uri: appConfig.avatarPath + res.avatar,
                              }}
                              style={styles.profileImage}
                            />
                          )}
                          <View style={styles.userNameandCompanyView}>
                            <Text style={styles.UserNameText}>
                              {res?.chat_name}
                            </Text>
                            <Text style={styles.CompanyText}>
                              {res?.user_departments}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View style={styles.borderLine}></View>
                      </>
                    );
                  })}
                </View>
              )}
              {this.state.searchMessageList.length > 0 && (
                <View>
                  <Text style={[styles.UserText, { marginTop: "1%" }]}>
                    Messages
                  </Text>
                  {this.state?.searchMessageList?.map((res) => {
                    return (
                      <>
                        <TouchableOpacity
                          onPress={() => this.onSearchClick(res, "seacrhTab")}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{
                                paddingLeft: "5%",
                                paddingTop: "2%",
                                fontSize: 17,
                                fontFamily: "Roboto-Regular",
                              }}
                            >
                              {res?.chat_name}
                            </Text>
                            <Text
                              style={{
                                color: "#878787",
                                fontSize: 10,
                                marginRight: "2%",
                                marginBottom: "3%",
                              }}
                            >
                              {moment.utc(res.time).local("tr").fromNow()}
                            </Text>
                          </View>
                          <Text
                            style={{
                              paddingLeft: "5%",
                              fontFamily: "Roboto-Regular",
                              fontSize: 13,
                              lineHeight: 20,
                            }}
                          >
                            <HighlightText
                              highlightStyle={{
                                backgroundColor: "yellow",
                                fontWeight: "bold",
                              }}
                              searchWords={keywordsWithoutSpace}
                              textToHighlight={res?.message}
                            />
                          </Text>
                        </TouchableOpacity>
                        <View style={styles.borderLine}></View>
                      </>
                    );
                  })}
                </View>
              )}
            </ScrollView>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme,
    user: state.auth.user,
    searchQuery: state.stateHandler.searchQuery,
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

export default connect(mapStateToProps, mapDispatchToProps)(Searhlist);

const styles = StyleSheet.create({
  searchTextInput: {
    width: "80%",
    // height: Platform.OS == 'android' ? '1%' : '100%',s
    color: "white",
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
  },
  UserText: {
    fontSize: 17,
    backgroundColor: "#E5E5E5",
    paddingLeft: "5%",
    padding: "1.3%",
    fontFamily: "Roboto-Bold",
    marginBottom: "1%",
  },
  userInnerView: {
    flexDirection: "row",
    paddingLeft: "5%",
    marginBottom: "1%",
  },
  userNameandCompanyView: {
    marginLeft: "2%",
    marginTop: "1%",
  },
  UserNameText: {
    fontSize: 17,
    fontFamily: "Roboto-Regular",
    marginBottom: "3%",
  },
  CompanyText: {
    fontSize: 12,
    color: "#878787",
    width: "80%",
  },
  borderLine: {
    borderWidth: Platform.OS == "android" ? 0.2 : 0.7,
    borderColor: "#ebebeb",
    width: "100%",
    marginLeft: "5%",
    marginVertical: "2%",
  },
});
