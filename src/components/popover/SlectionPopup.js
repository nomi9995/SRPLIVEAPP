import React, {Component} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert,Clipboard} from 'react-native';

import {W_WIDTH} from '../../utils/regex';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import moment from 'moment';

//Component
import RemindMeModel from '../Modal/RemindMeModel';

//redux
import {connect} from 'react-redux';
import {
  setOnLongPress,
  setReplyState,
  setMessageEdit,
} from '../../store/actions';

//Service
import ChatServices from '../../services/ChatServices';
import {MessagesQuieries} from '../../database/services/Services';

class SelectionPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusModal: false,
    };
  }

  AcknowledgeRequest = () => {
    const {longPress} = this.props;
    let token = this.props.user?.token;
    longPress.map(message => {
      let payload = {
        message_id: message._id,
        chat_type: message.chat_type,
      };
      // ChatServices.acknowledgeRequest(payload, token).then(res => {
      //   this.props.callClose();
      // });
      let Chatuser = message.chatUser;
      let Userid = this.props.user.user.id;
      ChatServices.acknowledgeRequest(payload, token).then(res => {
        var deleteMeassgeId = message._id;
        var onlineUserId = Userid;
        var chatUserId = Chatuser;
        if (res.data.data.success) {
          MessagesQuieries.updateMessageAction(
            {chatUserId, onlineUserId, deleteMeassgeId},
            res3 => {
              if (res3) {
                MessagesQuieries.selectDb({onlineUserId, chatUserId}, res2 => {
                  this.props.callClose();
                });
              }
            },
          );
        }
      });
    });
  };

  StarredMessage = () => {
    const {longPress} = this.props;
    let token = this.props.user?.token;
    longPress.map(message => {
      let payload = {
        message_id: message._id,
        chat_type: message.chat_type,
      };
      let Chatuser = message.chatUser;
      let Userid = this.props.user.user.id;
      ChatServices.starMessage(payload, token).then(res => {
        var messageId = message._id;
        var onlineUserId = Userid;
        var chatUserId = Chatuser;
        if (res.data.data.success) {
          let star = 1;
          if (res.data.data.message == 'Message Unstarred') {
            star = 0;
          }
          MessagesQuieries.updateMessageActionAsStar(
            {chatUserId, onlineUserId, messageId, star},
            res3 => {
              if (res3) {
                MessagesQuieries.selectDb({onlineUserId, chatUserId}, res2 => {
                  this.props.messageupdateresponse(res2);
                  this.props.onSetOnLongPress([]);
                  this.props.callClose();
                });
              }
            },
          );
        }
      });
    });
  };
  RespondLater = () => {
    const {longPress} = this.props;
    let token = this.props.user?.token;
    longPress.map(message => {
      let payload = {
        message_id: message._id,
        chat_type: message.chat_type,
      };
      // ChatServices.reponseLaterRequest(payload, token).then(res => {
      //   this.props.onSetOnLongPress([])
      //   this.props.callClose();
      // });
      let Chatuser = message.chatUser;
      let Userid = this.props.user.user.id;
      ChatServices.reponseLaterRequest(payload, token).then(res => {
        var messageId = message._id;
        var onlineUserId = Userid;
        var chatUserId = Chatuser;
        if (res.data.data.success) {
          let replyLater = 1;
          if (res.data.data.message == 'Resond later cleared') {
            replyLater = 0;
          }
          MessagesQuieries.updateMessageActionAsRespondLater(
            {chatUserId, onlineUserId, messageId, replyLater},
            res3 => {
              if (res3) {
                MessagesQuieries.selectDb({onlineUserId, chatUserId}, res2 => {
                  this.props.messageupdateresponse(res2);
                  this.props.onSetOnLongPress([]);
                  this.props.callClose();
                });
              }
            },
          );
        }
      });
    });
  };

  deleteMessage = () => {
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
        var deleteMeassgeId = message._id;
        var onlineUserId = Userid;
        var chatUserId = Chatuser;
        if (res.data.data.success) {
          MessagesQuieries.updateMessageAction(
            {chatUserId, onlineUserId, deleteMeassgeId},
            res3 => {
              if (res3) {
                MessagesQuieries.selectDb({onlineUserId, chatUserId}, res2 => {
                  this.props.callClose();
                });
              }
            },
          );
        }
      });
    });
  };

  afterDbUpdated = data => {
    this.props.messageupdateresponse(data);
    this.props.onSetOnLongPress([]);
    this.props.callClose();
    this.setState({statusModal: false});
  };

  editMessage = () => {
    this.props.onSetReplyState(true);
    this.props.onSetMessageEdit(true);
    this.props.callClose();
  };

  copyToClipboard = (data) => {
    Clipboard.setString(data)
    this.props.onSetOnLongPress([])
    this.props.callClose();
  }

  render() {
    let postion = '';
    let shouldEdit = false;
    let messagetype = ''
    let messageData = ''
    const {longPress} = this.props;
    let date = moment.utc().zone('+0300').format('YYYY-MM-DD HH:mm:ss');
    let timeCheck = moment(longPress[0].time, 'YYYY-MM-DD HH:mm:ss').from(date);
    longPress.map(message => {
      postion = message.user._id
      messagetype = message.type

      messageData = message.message

    });
    if (
      postion === 2 &&
      longPress.length === 1 &&
      timeCheck === 'a few seconds ago'
    ) {
      if(longPress[0].type === 1) {
        shouldEdit = true;
      } else if(longPress[0].type === 8) {
        if(JSON.parse(longPress[0].message).new_message.new_type === 1) {
          shouldEdit = true
        }
      }
    }
    return (
      <View style={{width: W_WIDTH / 1.75, backgroundColor: 'white'}}>
        <View>
          {messagetype == 1 &&
          <TouchableOpacity style={styles.popButton} 
          onPress={() => this.copyToClipboard(messageData) }
          >
            <View style={styles.iconContainer}>
              <FontAwesome5 name="copy" size={30} color="#c2c2c2" />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.popTitleText}>copy</Text>
            </View>
          </TouchableOpacity>
          }

          {/* {shouldEdit && (
            <TouchableOpacity
              style={styles.popButton}
              onPress={this.editMessage}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="pen-fancy" size={30} color="#c2c2c2" />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.popTitleText}>Edit</Text>
              </View>
            </TouchableOpacity>
          )} */}
          {/* {postion === 2 && (
            <TouchableOpacity
              style={styles.popButton}
              onPress={() => this.deleteMessage()}>
              <View style={styles.iconContainer}>
                <FontAwesome5 name="trash-alt" size={30} color="#c2c2c2" />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.popTitleText}>Delete</Text>
              </View>
            </TouchableOpacity>
          )} */}

          <TouchableOpacity
            style={styles.popButton}
            onPress={() => this.AcknowledgeRequest()}>
            <View style={styles.iconContainer}>
              <FontAwesome5 name="hand-pointer" size={30} color="#c2c2c2" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.popTitleText} numberOfLines={1}>
                Acknowledgement
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.popButton}
          onPress={() => this.StarredMessage()}>
          <View style={styles.iconContainer}>
            <Icon name="flag-triangle" size={30} color="#c2c2c2" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.popTitleText} numberOfLines={1}>
              Starred Messages
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.popButton}
          onPress={() => this.RespondLater()}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="history" size={30} color="#c2c2c2" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.popTitleText} numberOfLines={1}>
              Respond Later
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.popButton}
          onPress={() => {
            this.setState({statusModal: true});
          }}>
          <View style={styles.iconContainer}>
            <Ionicons name="alarm-outline" size={30} color="#c2c2c2" />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.popTitleText}>Remind me</Text>
          </View>
          {this.state.statusModal ? (
            <RemindMeModel
              visible={this.state.statusModal}
              closeModal={data => this.setState({statusModal: data})}
              afterDbUpdate={data => this.afterDbUpdated(data)}
            />
          ) : null}
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    longPress: state.messages.longPress,
    user: state.auth.user,
    remindModalState: state.stateHandler.remindModalState,
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
    onSetMessageEdit: data => {
      dispatch(setMessageEdit(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectionPopup);

const styles = StyleSheet.create({
  popButton: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    marginVertical: 1,
  },

  iconContainer: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },

  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 5,
  },

  popTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    fontFamily: 'Roboto-Regular',
  },
});
