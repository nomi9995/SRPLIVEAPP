import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import appConfig from '../../../utils/appConfig';
import ChatServices from '../../../services/ChatServices';

//Redux
import { connect } from 'react-redux';
import { setOnLongPress } from '../../../store/actions';

//Components
import {
  ChatUsersQuieries,
  MessagesQuieries,
} from '../../../database/services/Services';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome5';
import { TextInput } from 'react-native-gesture-handler';

// let selectedContacts = [];
let keywordsWithoutSpace = [];
class ForwardContactList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      forwardList: [],
      forwardingMessage: false,
      showSearch: false,
      searchText: '',
      searchResponse: [],
      selectedContacts: []
    };
  }

  componentDidMount = () => {
    this.getUserDataDb();
  };

  getUserDataDb = () => {
    let offset = this.state.offset;
    ChatUsersQuieries.getAllUsersList(offset, res => {
      if (res !== null) {
        this.setState({ forwardList: [...this.state.forwardList, ...res] });
      }
    });
  };

  onSelectForward = () => {
    this.setState({ forwardingMessage: true });
    let formdata = new FormData();
    for (let i = 0; i < this.props.longPress.length; i++) {
      formdata.append(`forward_message[${i}]`, this.props.longPress[i]._id);
      formdata.append(
        'is_room',
        this.props.longPress[i].chat_type === 'group' ? true : false,
      );
    }

    this.state.selectedContacts.forEach(user => {
      formdata.append(
        'selected_chat_rooms[]',
        user.is_room === 1 ? user.user_id : 0,
      );
      formdata.append(
        'selected_chat_users[]',
        user.is_room === 0 ? user.user_id : 0,
      );
    });

    let token = this.props.user.token;
    ChatServices.forwardMessage(formdata, token).then(res => {
      this.getAllUpdatedMessages();
    });
  };

  getAllUpdatedMessages = () => {
    let payload = {
      after: this.props.appCloseTime,
    };
    let token = this.props.user?.token;
    ChatServices.updatedMessages(payload, token).then(res => {
      let tableName = 'messages_list_table';
      let resp = res;
      let onlineUserId = this.props.user?.user.id;
      MessagesQuieries.insertAndUpdateMessageList(
        { tableName, resp, onlineUserId },
        res3 => {
          const { selectedUser } = this.props?.route?.params;
          this.setState({ forwardingMessage: false });
          this.props.onSetOnLongPress([]);
          this.props.navigation.replace('MessageScreen', {
            selectedUser: selectedUser,
          });
        },
      );
    });
  };

  backAction = () => {
    if (this.state.showSearch) {
      this.setState({ showSearch: false, searchResponse: [], searchText: '' })
    } else {
      const { selectedUser } = this.props?.route?.params;
      this.props.navigation.replace('MessageScreen', {
        selectedUser: selectedUser,
      });
    }
  };

  searchAction = () => {
    this.setState({ showSearch: true })
  };

  onChangeText = async (text) => {
    this.setState({ searchText: text })
    if (text === '') {
      this.setState({ searchResponse: [] });
    } else if (text.length >= 4) {
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
      MessagesQuieries.searchMsgAndUserListDb({ onlineUser, text }, async res => {
        console.log('res: ', res);
        await this.setState({ searchResponse: res });
      });
    } else if (text.length < 4) {
      this.setState({ searchResponse: [] });
    }
  }

  selectContacts = user => {
    if (!this.state.selectedContacts.includes(user)) {
      this.state.selectedContacts.push(user);
    } else {
      const ind = this.state.selectedContacts.findIndex(
        item => user.user_id === item.user_id,
      );
      if (ind > -1) {
        this.state.selectedContacts.splice(ind, 1);
      }
    }

    this.setState({selectedContacts: this.state.selectedContacts})
  };

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  renderUsers = (res, index) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          key={index}
          onPress={() => this.selectContacts(res)}
          style={styles.card}>
          {res.avatar === null ? (
            <FastImage
              source={require('../../../assets/deafultimage.png')}
              style={styles.profileImage}
            />
          ) : (
            <FastImage
              source={{ uri: appConfig.avatarPath + res.avatar }}
              style={styles.profileImage}
            />
          )}

          <Text style={styles.nameText}>{res.chat_name}</Text>
        </TouchableOpacity>
        
        {
          this.state.selectedContacts?.map(user => {
            if (user.user_id === res.user_id) {
              return (
              <View style={styles.tick}>
                <FontAwesome
                  name={'check-circle'}
                  size={25}
                  color="green"
                />
              </View>
              )
            }
          })
        }
      </View>
    )
  }

  render() {
    const { forwardList, searchResponse } = this.state;
    return (
      <>
        <SafeAreaView style={{ backgroundColor: '#008069' }} />

        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backBtn} onPress={this.backAction}>
            <FontAwesome name={'arrow-left'} size={20} color={'white'} />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            {
              this.state.showSearch ? (
                <TextInput
                  autoFocus={true}
                  style={styles.searchInputText}
                  placeholder="Search"
                  placeholderTextColor="white"
                  value={this.state.searchText}
                  selectionColor="white"
                  onChangeText={(text) => this.onChangeText(text)}
                />
              ) : (
                <Text style={styles.headerText}>Forward To</Text>
              )
            }
          </View>

          <TouchableOpacity
            style={styles.searchBtn}
            onPress={this.searchAction}>
            <FontAwesome name={'search'} size={20} color={'white'} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.bodyContainer}
          onScroll={async ({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              await this.setState({ offset: this.state.offset + 100 });
              this.getUserDataDb();
            }
          }}>
          <View>
            {this.state.forwardingMessage ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size={'small'} color={'#00897B'} />
                <Text>Forwarding Messages</Text>
              </View>
            ) : (
              searchResponse.length > 0 ? (
                searchResponse.map((res, index) => {
                  return (
                    this.renderUsers(res, index)
                  )
                })
              ) : (
                forwardList.map((res, index) => {
                  return (
                    this.renderUsers(res, index)
                  )
                })
              )
            )}
          </View>
        </ScrollView>

        {this.state.selectedContacts.length > 0 && (
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={this.onSelectForward}>
            <FontAwesome name={'paper-plane'} size={25} color="#fff" />
          </TouchableOpacity>
        )}
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    longPress: state.messages.longPress,
    user: state.auth.user,
    appCloseTime: state.stickers.appCloseTime,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetOnLongPress: data => {
      dispatch(setOnLongPress(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForwardContactList);

const styles = StyleSheet.create({
  safeAreaStyle: {
    backgroundColor: '#008069',
  },

  headerContainer: {
    flexDirection: 'row',
    height: '7%',
    backgroundColor: '#008069',
  },

  backBtn: {
    flex: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTextContainer: {
    flex: 0.75,
    justifyContent: 'center',
  },

  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },

  searchInputText: {
    color: '#fff'
  },

  searchBtn: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bodyContainer: {
    backgroundColor: '#f9f9f9',
  },

  loaderContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 700,
  },

  card: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    marginVertical: 2,
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: 15,
  },

  nameText: {
    fontSize: 16,
    color: '#121b24',
    marginLeft: 10,
  },

  tick: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginVertical: 2,
  },

  sendBtn: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: '#008069',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
