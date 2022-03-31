import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Platform,
  NativeModules,
  findNodeHandle,
  BackHandler,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome5';
import {Popover} from 'react-native-modal-popover';
import appConfig from '../utils/appConfig';
import LocalTimeZone from 'react-native-localize';

//Redux
import {
  setOnLongPress,
  setReplyState,
  setSickerOpen,
  setMediaOptionsOpen,
  setSearchQuery,
  setSearchState,
  setSearchShow,
  setRenderState,
  setMessageEdit,
  setMessageText,
} from '../store/actions';
import {connect} from 'react-redux';
import Share from 'react-native-share';
import ChatServices from '../services/ChatServices';

//Component
import Popup from './Popup';
import SelectionPopup from '../components/popover/SlectionPopup';

// Database
import {MessagesQuieries} from '../database/services/Services';
import SearchList from '../screens/dashboard/userList/SearchList';

import RNFetchBlob from 'rn-fetch-blob';
import {onDownload} from '../utils/regex';
import moment from 'moment';

const {config, fs} = RNFetchBlob;
const {dirs} = RNFetchBlob.fs;

class HomeHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPopover: false,
      popoverAnchor: {x: 0, y: 0, width: 0, height: 0},
      SlectedpopoverAnchor: {x: 0, y: 0, width: 0, height: 0},
      mediaExist: 0,
    };
  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.hardwareBack);
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.hardwareBack);
  };

  hardwareBack = () => {
    if (this.porps.searchShow) {
      this.searchBackAction();
    } else {
      this.backButton();
    }

    return true;
  };

  changeName = text => {
    const {selectedUser, user} = this.props;
    let onlineUser = user.user.id;
    let chatUser = selectedUser?.user_id;
    if (this.props.screen === 'message') {
      if (text === '') {
        this.props.searchResponse('');
        this.props.onSetSearchQuery(text);
      } else {
        this.props.onSetSearchQuery(text);
        MessagesQuieries.searchMsgDb({chatUser, onlineUser, text}, res => {
          this.props.searchResponse(res);
        });
      }
    } else {
      this.props.onSetSearchQuery(text);
      if (text === '') this.props.onSetSearchState(false);
      else this.props.onSetSearchState(true);
    }
  };

  searchButton = () => {
    // this.props.onSetSearchShow(true)
    this.props.navProps.navigation.navigate('SearchList');
  };

  hardwareBack = () => {
    if (this.props.searchShow) {
      this.searchBackAction();
    } else if (this.state.showPopover) {
      this.onClosePopover();
    } else if (this.props.stickerOpen || this.props.mediaOptionsOpen) {
      this.props.onSetMediaOptionsOpen(false);
      this.props.onSetSickerOpen(false);
    } else {
      this.backButton();
    }

    return true;
  };

  searchBackAction = () => {
    const {navProps} = this.props;
    this.props.onSetSearchQuery('');
    this.props.onSetSearchShow(false);
    this.props.onSetSearchState(false);
    this.props.onSetRenderState(true);
    if (this.props.screen === 'message') {
      this.props.searchResponse('');
    }
  };

  backButton = () => {
    const {screen, navProps, backPress, longPress} = this.props;
    if (this.props.navProps?.route?.params?.screen !== undefined) {
      navProps.navigation.goBack();
    } else {
      if (longPress.length !== 0) {
        this.props.onSetOnLongPress([]);
        this.props.onSetReplyState(false);
        this.props.onSetMessageEdit(false);
        this.props.onSetMessageText(null);
        this.props.onSetMediaOptionsOpen(false);
        this.props.onSetSickerOpen(false);
      } else if (screen === 'message') {
        navProps.navigation.replace('Home');
        this.props.onSetMessageText(null);
        this.props.onSetMediaOptionsOpen(false);
        this.props.onSetSickerOpen(false);
      } else if (screen === 'home') {
        BackHandler.exitApp();
      } else {
        navProps.navigation.goBack();
      }
    }
  };

  optionsHandler = () => {
    this.setState({showPopover: true});
    const handle = findNodeHandle(this.button);
    if (handle) {
      NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
        this.setState({
          popoverAnchor: {x, y, width, height},
        });
      });
    }
  };

  onClosePopover = () => {
    this.setState({showPopover: false});
  };

  ProfileChange = data => {
    if (data.user_type) {
      this.props.navProps.navigation.navigate('Profile');
    } else {
      this.props.onSetMediaOptionsOpen(false);
      this.props.onSetSickerOpen(false);
      this.props.navProps.navigation.navigate('ChatUserProfile', {
        userProfiledata: this.props.userData,
      });
    }
  };

  filterDataResponse = data => {
    this.props.filterdata(data);
    this.setState({showPopover: false});
  };

  shareButton = () => {
    const {longPress} = this.props;
    longPress.map(message => {
      let payload = {
        message_id:
          message.type == 7
            ? JSON.parse(message.message).name
            : JSON.parse(message.message).content[0],
      };
      const shareOptions = {
        url:
          message.type == 6
            ? fs.dirs.DocumentDir + '/srp_live/Files/' + payload.message_id.name
            : message.type == 2
            ? fs.dirs.DocumentDir + '/srp_live/Images/' + payload.message_id
            : message.type == 7
            ? fs.dirs.DocumentDir + '/srp_live/Audios/' + payload.message_id
            : message.type == 11
            ? fs.dirs.DocumentDir +
              '/srp_live/Videos/' +
              payload.message_id.name
            : null,
      };

      Share.open(shareOptions)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    });
  };

  deleteMessage = () => {
    console.log('1');
    const {longPress} = this.props;
    let token = this.props.user?.token;
    longPress.map(message => {
      let payload = {
        message_id: message._id,
        chat_type: message.chat_type,
      };
      let Chatuser = message.chatUser;
      let Userid = this.props.user.user.id;

      ChatServices.deleteMessage(payload, token).then(res => {
        console.log('2', res);
        var deleteMeassgeId = message._id;
        var onlineUserId = Userid;
        var chatUserId = Chatuser;
        if (res.data.data.success) {
          MessagesQuieries.updateMessageAction(
            {chatUserId, onlineUserId, deleteMeassgeId},
            res3 => {
              if (res3) {
                MessagesQuieries.selectDb({onlineUserId, chatUserId}, res2 => {
                  // this.props.callClose();
                });
              }
            },
          );
        }
      });
    });
  };
  editMessage = () => {
    this.props.onSetReplyState(true);
    this.props.onSetMessageEdit(true);
  };

  render() {
    const {
      screen,
      navProps,
      userData,
      longPress,
      chatUserOnlineStatus,
      typingStatus,
      selectedUser,
    } = this.props;
    console.log('screen', screen);
    let postion = '';
    let shouldEdit = false;
    var serverTime = moment.tz(longPress[0]?.time, 'UTC').format();
    let localTimeZone = moment
      .tz(serverTime, LocalTimeZone.getTimeZone())
      .format();
    let timeCheck = moment(localTimeZone, 'YYYY-MM-DD HH:mm:ss').fromNow();
    longPress?.map(message => {
      postion = message?.user._id;
    });
    if (
      postion === 2 &&
      longPress.length === 1 &&
      timeCheck === 'a few seconds ago'
    ) {
      if (longPress[0].type === 1) {
        shouldEdit = true;
      } else if (longPress[0].type === 8) {
        if (JSON.parse(longPress[0]?.message)?.new_message?.new_type === 1) {
          shouldEdit = true;
        }
      }
    }
    if (userData === 'forward') {
      return (
        <SafeAreaView style={{backgroundColor: '#008069'}}>
          <View style={styles.header}>
            <View style={styles.mainFlex}>
              <View style={styles.rowDirectionFlex}>
                <TouchableOpacity
                  style={styles.backIcon}
                  onPress={() => {
                    this.props.onSetOnLongPress([]);
                    this.props.onSetReplyState(false);
                    this.props.onSetMessageEdit(false);
                    this.props.onSetMessageText(null);
                    this.props.onSetMediaOptionsOpen(false);
                    this.props.onSetSickerOpen(false);
                    navProps.navigation.replace('MessageScreen', {
                      selectedUser: selectedUser,
                    });
                  }}>
                  <FontAwesome name={'arrow-left'} size={20} color={'white'} />
                </TouchableOpacity>
                <Text style={styles.contactListText}>Contact List</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      );
    }
    if (longPress.length !== 0) {
      return (
        <SafeAreaView style={{backgroundColor: '#008069'}}>
          <View style={styles.header1}>
            <View style={styles.mainFlex}>
              <View style={styles.rowDirectionFlex}>
                <TouchableOpacity
                  style={styles.backIcon}
                  onPress={() => this.backButton()}>
                  <FontAwesome name={'arrow-left'} size={20} color={'white'} />
                </TouchableOpacity>
                <Text style={styles.slectedMessagesCountText}>
                  {longPress.length}
                </Text>
              </View>
              <View style={styles.iconsFlex}>
                {this.props.longPress.length == 1 ? (
                  <>
                    {this.props.longPress[0].type == 2 ||
                    this.props.longPress[0].type == 6 ||
                    this.props.longPress[0].type == 7 ||
                    this.props.longPress[0].type == 11 ? (
                      <TouchableOpacity
                        style={[styles.iconDesign, {alignItems: 'center'}]}
                        onPress={() => this.shareButton()}>
                        <FontAwesome
                          name={'share-alt'}
                          size={20}
                          color={'white'}
                        />
                        <Text style={{color: 'white', fontSize: 12}}>
                          share
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </>
                ) : null}
                <View style={{flexDirection: 'row'}}>
                  {shouldEdit && (
                    <TouchableOpacity
                      style={[styles.iconDesign, {alignItems: 'center'}]}
                      onPress={this.editMessage}>
                      <FontAwesome
                        name={'pen-fancy'}
                        size={20}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.iconDesign, {alignItems: 'center'}]}
                    onPress={() => this.deleteMessage()}>
                    <FontAwesome name={'trash'} size={20} color={'white'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.onSetReplyState(true);
                    }}
                    style={[styles.iconDesign, {alignItems: 'center'}]}>
                    <FontAwesome name={'reply'} size={20} color={'white'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navProps.navigation.replace('ForwardContactList', {
                        selectedUser: selectedUser,
                      })
                    }
                    style={[styles.iconDesign, {alignItems: 'center'}]}>
                    <FontAwesome name={'share'} size={20} color={'white'} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    ref={r => {
                      this.button = r;
                    }}
                    style={styles.iconDesign}
                    onPress={this.optionsHandler}>
                    <FontAwesome
                      name={'ellipsis-v'}
                      size={20}
                      color={'white'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <Popover
            visible={this.state.showPopover}
            fromRect={this.state.popoverAnchor}
            onClose={() => {
              this.setState({showPopover: false});
            }}
            placement="bottom"
            useNativeDriver={true}
            backgroundStyle={{color: 'transparent'}}
            contentStyle={{backgroundColor: 'white'}}
            arrowStyle={{borderTopColor: 'transparent'}}>
            <SelectionPopup
              navProps={this.props}
              callClose={() => {
                this.setState({showPopover: false});
              }}
              selectedUser={selectedUser}
              messageupdateresponse={data =>
                this.props.messageupdateresponse(data)
              }
            />
          </Popover>
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={{backgroundColor: '#008069'}}>
          {this.props.searchShow ? (
            <View style={styles.searchView}>
              <TouchableOpacity
                onPress={this.searchBackAction}
                style={{padding: 5}}>
                <FontAwesome name={'arrow-left'} size={20} color={'white'} />
              </TouchableOpacity>
              <TextInput
                autoFocus={true}
                style={styles.searchTextInput}
                placeholder="Search"
                placeholderTextColor="white"
                value={this.props.searchQuery}
                selectionColor="white"
                onChangeText={text => this.changeName(text)}
              />
            </View>
          ) : (
            <View style={styles.header}>
              <View style={styles.mainFlex}>
                <View style={styles.rowDirectionFlex}>
                  {screen === 'message' ||
                  screen === 'allUser' ||
                  screen == 'groupList' ? (
                    <TouchableOpacity
                      style={styles.backIcon}
                      onPress={() => this.backButton()}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <FontAwesome
                          name={'arrow-left'}
                          size={20}
                          color={'white'}
                        />
                        {screen == 'message' && (
                          <FastImage
                            source={
                              userData?.avatar === null ||
                              userData?.avatar_url === '' ||
                              userData?.cover_image === null ||
                              userData?.cover_image === ''
                                ? require('../assets/deafultimage.png')
                                : {
                                    uri:
                                      userData?.avatar === undefined ||
                                      userData?.cover_image === undefined
                                        ? userData?.avatar === undefined
                                          ? userData?.avatar_url
                                          : appConfig.avatarPath +
                                            userData?.avatar
                                        : userData?.cover_image === undefined
                                        ? userData?.cover_image
                                        : appConfig.avatarPath +
                                          userData?.cover_image,
                                  }
                            }
                            style={styles.profileImage}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  ) : null}
                  {screen == 'allUser' || screen == 'groupList' ? null : (
                    <>
                      {screen != 'message' && (
                        <FastImage
                          source={
                            userData?.avatar === null ||
                            userData?.avatar_url === '' ||
                            userData?.cover_image === null ||
                            userData?.cover_image === ''
                              ? require('../assets/deafultimage.png')
                              : {
                                  uri:
                                    userData?.avatar === undefined ||
                                    userData?.cover_image === undefined
                                      ? userData?.avatar === undefined
                                        ? userData?.avatar_url
                                        : appConfig.avatarPath +
                                          userData?.avatar
                                      : userData?.cover_image === undefined
                                      ? userData?.cover_image
                                      : appConfig.avatarPath +
                                        userData?.cover_image,
                                }
                          }
                          style={styles.profileImage}
                        />
                      )}

                      <View>
                        <TouchableOpacity
                          style={styles.rowDirectionFlex}
                          onPress={() => this.ProfileChange(userData)}>
                          <Text style={styles.usernameText}>
                            {userData?.first_name !== undefined ? (
                              <Text>
                                {userData?.first_name +
                                  ' ' +
                                  userData?.last_name}
                              </Text>
                            ) : userData?.chat_name !== undefined ? (
                              <Text>{userData?.chat_name}</Text>
                            ) : (
                              <Text>{userData?.name}</Text>
                            )}
                          </Text>
                        </TouchableOpacity>
                        {this.props?.chatUserOnlineStatus !== null &&
                          chatUserOnlineStatus.map(res => {
                            let selectedUserId = userData.user_id;
                            if (typingStatus) {
                              return (
                                <Text style={styles.onlineUserStatusText}>
                                  Typing...
                                </Text>
                              );
                            } else if (res.user === selectedUserId) {
                              if (res.online_status === 1) {
                                return (
                                  <Text style={styles.onlineUserStatusText}>
                                    Online
                                  </Text>
                                );
                              }
                              if (res.online_status === 2) {
                                return (
                                  <Text style={styles.onlineUserStatusText}>
                                    Offline
                                  </Text>
                                );
                              }
                              if (res.online_status === 3) {
                                return (
                                  <Text style={styles.onlineUserStatusText}>
                                    Busy
                                  </Text>
                                );
                              }
                              if (res.online_status === 4) {
                                return (
                                  <Text style={styles.onlineUserStatusText}>
                                    Away
                                  </Text>
                                );
                              }
                            }
                          })}
                      </View>
                    </>
                  )}
                </View>
                <View style={styles.iconsFlex}>
                  <TouchableOpacity style={styles.iconDesign}>
                    {screen === 'message' ? (
                      <FontAwesome name={'phone'} size={20} color={'white'} />
                    ) : (
                      <TouchableOpacity onPress={this.searchButton}>
                        <FontAwesome
                          name={'search'}
                          size={20}
                          color={'white'}
                        />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                  {screen == 'allUser' || screen == 'groupList' ? null : (
                    <TouchableOpacity
                      ref={r => {
                        this.button = r;
                      }}
                      style={styles.iconDesign}
                      onPress={this.optionsHandler}>
                      <FontAwesome
                        name={'ellipsis-v'}
                        size={20}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
          <Popover
            visible={this.state.showPopover}
            fromRect={this.state.popoverAnchor}
            onClose={() => {
              this.setState({showPopover: false});
            }}
            useNativeDriver={true}
            placement="bottom"
            backgroundStyle={{color: 'transparent'}}
            contentStyle={{backgroundColor: 'white'}}
            arrowStyle={{borderTopColor: 'transparent'}}>
            <Popup
              navProps={this.props}
              searchShow={() => this.props.onSetSearchShow(true)}
              callClose={() => this.setState({showPopover: false})}
              filterData={data => this.filterDataResponse(data)}
            />
          </Popover>
        </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    backgroundColor: '#008069',
    paddingVertical: '2%',
  },
  header1: {
    justifyContent: 'space-between',
    backgroundColor: '#008069',
    paddingVertical: '3%',
  },
  mainFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowDirectionFlex: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: '5%',
  },
  usernameText: {
    marginLeft: 0,
    fontFamily: 'Roboto-Medium',
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  onlineUserStatusText: {
    marginLeft: 0,
    marginTop: 5,
    fontFamily: 'Roboto-Medium',
    color: 'white',
  },
  iconsFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5%',
  },
  iconDesign: {
    marginLeft: 5,
    padding: 5,
  },
  backIcon: {
    marginLeft: 5,
    padding: 5,
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#128C7E',
    height: 50,
  },
  searchTextInput: {
    width: '90%',
    height: Platform.OS == 'android' ? '100%' : '50%',
    color: 'white',
  },
  slectedMessagesCountText: {
    fontSize: 16,
    color: 'white',
    marginLeft: '15%',
    fontWeight: 'bold',
  },
  contactListText: {
    fontSize: 16,
    color: 'white',
    marginLeft: '15%',
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => {
  return {
    longPress: state.messages.longPress,
    replyState: state.stateHandler.replyState,
    mediaOptionsOpen: state.stateHandler.mediaOptionsOpen,
    stickerOpen: state.stateHandler.stickerOpen,
    searchQuery: state.stateHandler.searchQuery,
    searchShow: state.stateHandler.searchShow,
    user: state.auth.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetOnLongPress: data => {
      dispatch(setOnLongPress(data));
    },
    onSetReplyState: data => {
      dispatch(setReplyState(data));
    },
    onSetSickerOpen: data => {
      dispatch(setSickerOpen(data));
    },
    onSetMediaOptionsOpen: data => {
      dispatch(setMediaOptionsOpen(data));
    },
    onSetSearchQuery: data => {
      dispatch(setSearchQuery(data));
    },
    onSetSearchState: data => {
      dispatch(setSearchState(data));
    },
    onSetSearchShow: data => {
      dispatch(setSearchShow(data));
    },

    onSetRenderState: data => {
      dispatch(setRenderState(data));
    },
    onSetMessageEdit: data => {
      dispatch(setMessageEdit(data));
    },
    onSetMessageText: text => {
      dispatch(setMessageText(text));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeHeader);
