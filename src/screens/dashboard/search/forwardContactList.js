import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';

//Redux
import {
  setSearchQuery,
  setSearchState,
  setSearchShow,
} from '../../../store/actions';
import {connect} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome5';
import {MessagesQuieries} from '../../../database/services/Services';
import FastImage from 'react-native-fast-image';
import appConfig from '../../../utils/appConfig';
import ChatServices from '../../../services/ChatServices';

let keywordsWithoutSpace = [];
class ForwardContactListSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQueryUSerList: '',
      searchUserList: [],
      forwardingMessage: false,
    };
  }
  onSearchClick = (res, data) => {
    this.props.navigation.navigate('MessageScreen', {
      selectedUser: res,
      keywords: keywordsWithoutSpace,
    });
  };

  SearchUserAndMessage = async text => {
    await this.setState({searchQueryUSerList: text});

    let q = text;
    if (q === '') {
      this.setState({searchUserList: []});
    } else if (q.length >= 4) {
      let text = q;
      let onlineUser = this.props.user.user.id;
      let keywords = text.split(' ');
      let subQuery = '';
      keywords.forEach(word => {
        if (word !== '') {
          subQuery += `message LIKE '%${word}%' OR `;
          keywordsWithoutSpace.push(word);
        }
      });
      subQuery += `message LIKE '%${text}%'`;
      MessagesQuieries.searchMsgAndUserListDb({onlineUser, text}, async res => {
        await this.setState({searchUserList: res});
        if (res.length === 0) {
          await this.setState({showSearchUser: 'Nothing Found'});
        } else {
          await this.setState({showSearchUser: null});
        }
      });
    } else if (q.length < 4) {
      this.setState({searchUserList: []});
      await this.setState({showSearchUser: null});
    }
  };

  onSelectForward = item => {
    console.log('item', item);
    this.setState({forwardingMessage: true});
    let formdata = new FormData();
    for (let i = 0; i < this.props.longPress.length; i++) {
      formdata.append(`forward_message[${i}]`, this.props.longPress[i]._id);
      formdata.append(
        'is_room',
        this.props.longPress[i].chat_type === 'group' ? true : false,
      );
    }
    formdata.append(
      'selected_chat_rooms[]',
      item.is_room === 1 ? item.user_id : 0,
    );
    formdata.append(
      'selected_chat_users[]',
      item.is_room === 0 ? item.user_id : 0,
    );

    let token = this.props.user.token;
    ChatServices.forwardMessage(formdata, token).then(res => {
        console.log("forwardMessage",res)
      this.getAllUpdatedMessages();
    });
  };

  getAllUpdatedMessages = () => {
    let payload = {
      after: this.props.appCloseTime,
    };
    let token = this.props.user?.token;
    ChatServices.updatedMessages(payload, token).then(res => {
        console.log('updatedMessages',res)
      let tableName = 'messages_list_table';
      let resp = res;
      let onlineUserId = this.props.user?.user.id;
      MessagesQuieries.insertAndUpdateMessageList(
        {tableName, resp, onlineUserId},
        res3 => {
            console.log('updatemessage',res3)
          const {selectedUser} = this.props?.route?.params;
          this.setState({forwardingMessage: false});
        //   this.props.onSetOnLongPress([]);mahm
          console.log('forwarded')
          this.props.navigation.navigate('MessageScreen', {
            selectedUser: selectedUser,
          });
          this.setState({searchQueryUSerList:'',searchUserList:[]})
        },
      );
    });
  };

  render() {
      console.log('this.props',this.props)
    return (
      <>
        <SafeAreaView style={{backgroundColor: '#008069'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 5,
            }}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{paddingHorizontal: '2%'}}>
              <FontAwesome name={'arrow-left'} size={20} color={'white'} />
            </TouchableOpacity>
            <TextInput
              autoFocus={true}
              style={styles.searchTextInput}
              placeholder="Search"
              placeholderTextColor="white"
              value={this.state.searchQueryUSerList}
              selectionColor="white"
              onChangeText={text => this.SearchUserAndMessage(text)}
            />
          </View>
        </SafeAreaView>
        {this.state.forwardingMessage ? (
          <View style={styles.Loader_container}>
            <ActivityIndicator size={'small'} color={'#00897B'} />
            <Text>Forwarding Message</Text>
          </View>
        ) : (
          <>
            {this.state.showSearchUser !== null ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 20}}>Nothing Found</Text>
              </View>
            ) : (
              <>
                <ScrollView style={{flexGrow: 1, backgroundColor: 'white'}}>
                  {this.state.searchUserList.length > 0 && (
                    <View>
                      <Text style={styles.UserText}>Users</Text>
                      {this.state?.searchUserList?.map(res => {
                        return (
                          <>
                            <TouchableOpacity
                              style={styles.userInnerView}
                              onPress={() => this.onSelectForward(res)}>
                              {res.avatar === null ? (
                                <FastImage
                                  source={require('../../../assets/deafultimage.png')}
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
                </ScrollView>
              </>
            )}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    theme: state.theme.theme,
    user: state.auth.user,
    searchQuery: state.stateHandler.searchQuery,
    longPress: state.messages.longPress,
    appCloseTime: state.stickers.appCloseTime,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetSearchQuery: data => {
      dispatch(setSearchQuery(data));
    },
    onSetSearchState: data => {
      dispatch(setSearchState(data));
    },
    onSetSearchShow: data => {
      dispatch(setSearchShow(data));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForwardContactListSearch);

const styles = StyleSheet.create({
  searchTextInput: {
    width: '80%',
    // height: Platform.OS == 'android' ? '1%' : '100%',s
    color: 'white',
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
  },
  UserText: {
    fontSize: 17,
    backgroundColor: '#E5E5E5',
    paddingLeft: '5%',
    padding: '1.3%',
    fontFamily: 'Roboto-Bold',
    marginBottom: '1%',
  },
  userInnerView: {
    flexDirection: 'row',
    paddingLeft: '5%',
    marginBottom: '1%',
  },
  userNameandCompanyView: {
    marginLeft: '2%',
    marginTop: '1%',
  },
  UserNameText: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    marginBottom: '3%',
  },
  CompanyText: {
    fontSize: 12,
    color: '#878787',
    width: '80%',
  },
  borderLine: {
    borderWidth: Platform.OS == 'android' ? 0.2 : 0.7,
    borderColor: '#ebebeb',
    width: '100%',
    marginLeft: '5%',
    marginVertical: '2%',
  },
  Loader_container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 700,
  },
});
