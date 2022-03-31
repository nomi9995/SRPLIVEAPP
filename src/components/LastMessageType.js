import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome5';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
class LastMessageType extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {lastMessage} = this.props;
    if (lastMessage.last_message_type === 8) {
      let replyFile = JSON.parse(lastMessage.last_message).new_message;

      if (replyFile.new_type == 6 || replyFile.new_type == 11) {
        var lastmessage = JSON.parse(replyFile.new_content).content[0].name;
      } else if (replyFile.new_type == 2) {
        var lastmessage = JSON.parse(replyFile.new_content).content[0];
      } else if (replyFile.new_type == 7) {
        let message = JSON.parse(lastMessage.last_message).message;
        var lastmessage = JSON.parse(message).name;
      } else if (replyFile.new_type == 4) {
        var lastmessage = 'sticker';
      } else if (replyFile.new_type == 3) {
        var lastmessage = 'Gif';
      } else if (replyFile.new_type == 5) {
        var lastmessage = replyFile.new_content.url;
      } else {
        var lastmessage = replyFile.new_content;
      }
    }
    if (lastMessage.last_message_type === 9) {
      let forwardFile = JSON.parse(lastMessage.last_message);
      if (forwardFile.type == 6 || forwardFile.type == 11) {
        let message = JSON.parse(lastMessage.last_message).message;
        var lastForwardmessage = JSON.parse(message).content[0].name;
      } else if (forwardFile.type == 2) {
        let message = JSON.parse(lastMessage.last_message).message;
        var lastForwardmessage = JSON.parse(message).content[0];
      } else if (forwardFile.type == 7) {
        let message = JSON.parse(lastMessage.last_message).message;
        var lastForwardmessage = JSON.parse(message).name;
      } else if (forwardFile.type == 4) {
        var lastForwardmessage = 'sticker';
      } else if (forwardFile.type == 3) {
        var lastForwardmessage = 'Gif';
      } else if (forwardFile.type == 5) {
        var lastForwardmessage = JSON.parse(forwardFile.message).url;
      } else {
        var lastForwardmessage = JSON.parse(lastMessage.last_message).message;
      }
    }

    return (
      <>
        {lastMessage.last_message_status === 3 ? (
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <FontAwesome name={'ban'} size={12} color={'black'} />
            <Text
              style={{
                marginLeft: '5%',
                fontSize: 12,
                fontFamily: 'Roboto-Regular',
              }}>
              Deleted
            </Text>
          </View>
        ) : (
          <>
            {lastMessage.last_message_type === 1 ? (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: '#878787',
                    textAlignVertical: 'top',
                    flexWrap: 'wrap',
                    flexShrink: 1,
                  }}
                  numberOfLines={2}>
                  {lastMessage.sender_id == this.props?.user?.user.id && (
                    <>
                      {this.props.lastMessage.last_message_status == 0 ? (
                        <Icon
                          name="check"
                          size={15}
                          color="#979797"
                          style={{marginRight: '2%'}}
                        />
                      ) : this.props.lastMessage.last_message_status == 1 ? (
                        <Icon
                          name="done-all"
                          size={15}
                          color="#979797"
                          style={{marginRight: '10%'}}
                        />
                      ) : this.props.lastMessage.last_message_status == 2 ? (
                        <Icon
                          name="done-all"
                          size={15}
                          color="#547fff"
                          style={{marginRight: '2%'}}
                        />
                      ) : null}
                    </>
                  )}
                  {lastMessage.last_message}
                </Text>
              </View>
            ) : lastMessage.last_message_type === 2 ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {this.props.lastMessage.sender_id ==
                  this.props.user?.user?.id && (
                  <>
                    {this.props.lastMessage.last_message_status == 0 ? (
                      <Icon
                        name="check"
                        size={15}
                        color="#979797"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 1 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#979797"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 2 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#547fff"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : null}
                  </>
                )}

                <FontAwesome name={'image'} size={12} color={'#878787'} />
                <Text
                  style={{
                    marginLeft: '2%',
                    fontSize: 14,
                    fontFamily: 'Roboto-Regular',
                    color: '#878787',
                  }}>
                  image
                </Text>
              </View>
            ) : lastMessage.last_message_type === 3 ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {this.props.lastMessage.sender_id ==
                  this.props.user?.user?.id && (
                  <>
                    {this.props.lastMessage.last_message_status == 0 ? (
                      <Icon
                        name="check"
                        size={15}
                        color="#979797"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 1 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#979797"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 2 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#547fff"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : null}
                    <Text> </Text>
                  </>
                )}
                <FontAwesome name={'image'} size={12} color={'#878787'} />
                <Text
                  style={{
                    marginLeft: '5%',
                    fontSize: 14,
                    fontFamily: 'Roboto-Regular',
                    color: '#878787',
                  }}>
                  Gif
                </Text>
              </View>
            ) : lastMessage.last_message_type === 4 ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {this.props.lastMessage.sender_id ==
                  this.props.user?.user?.id && (
                  <>
                    {this.props.lastMessage.last_message_status == 0 ? (
                      <Icon
                        name="check"
                        size={15}
                        color="#979797"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 1 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#979797"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 2 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#547fff"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : null}
                    <Text> </Text>
                  </>
                )}
                <FontAwesome name={'dizzy'} size={12} color={'#878787'} />
                <Text
                  style={{
                    // marginLeft: '5%',
                    fontSize: 14,
                    fontFamily: 'Roboto-Regular',
                    color: '#878787',
                  }}>
                  {' '}
                  Stickers
                </Text>
              </View>
            ) : lastMessage.last_message_type === 5 ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {this.props.lastMessage.sender_id ==
                  this.props.user?.user?.id && (
                  <>
                    {this.props.lastMessage.last_message_status == 0 ? (
                      <Icon
                        name="check"
                        size={15}
                        color="#979797"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 1 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#979797"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 2 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#547fff"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : null}
                    <Text> </Text>
                  </>
                )}
                <FontAwesome name={'link'} size={12} color={'#878787'} />
                <Text
                  style={{
                    // marginLeft: '5%',
                    fontSize: 14,
                    fontFamily: 'Roboto-Regular',
                    color: '#878787',
                  }}>
                  {' '}
                  Link
                </Text>
              </View>
            ) : lastMessage.last_message_type === 6 ||
              lastMessage.last_message_type === 0 ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {this.props.lastMessage.sender_id ==
                  this.props.user?.user?.id && (
                  <>
                    {this.props.lastMessage.last_message_status == 0 ? (
                      <Icon
                        name="check"
                        size={15}
                        color="#979797"
                        style={{marginRight: '1%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 1 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#979797"
                        style={{marginRight: '1%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 2 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#547fff"
                        style={{marginRight: '1%', marginTop: '1.5%'}}
                      />
                    ) : null}
                    <Text> </Text>
                  </>
                )}
                <FontAwesome name={'file'} size={12} color={'#878787'} />
                <Text
                  style={{
                    marginLeft: '2%',
                    fontSize: 14,
                    fontFamily: 'Roboto-Regular',
                    color: '#878787',
                  }}>
                  File
                </Text>
              </View>
            ) : lastMessage.last_message_type === 7 ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {this.props.lastMessage.sender_id ==
                  this.props.user?.user?.id && (
                  <>
                    {this.props.lastMessage.last_message_status == 0 ? (
                      <Icon
                        name="check"
                        size={15}
                        color="#979797"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 1 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#979797"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 2 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#547fff"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : null}
                    <Text> </Text>
                  </>
                )}
                <FontAwesome name={'headphones'} size={12} color={'#878787'} />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: 'Roboto-Regular',
                    color: '#878787',
                  }}>
                  {' '}
                  Audio
                </Text>
              </View>
            ) : lastMessage.last_message_type === 8 ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {this.props.lastMessage.sender_id ==
                  this.props.user?.user?.id && (
                  <>
                    {this.props.lastMessage.last_message_status == 0 ? (
                      <Icon
                        name="check"
                        size={15}
                        color="#979797"
                        style={{marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 1 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#979797"
                        style={{marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 2 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#547fff"
                        style={{marginTop: '1.5%'}}
                      />
                    ) : null}
                  </>
                )}
                <Text
                  style={{
                    marginLeft: '2%',
                    fontFamily: 'Roboto-Regular',
                    color: '#878787',
                  }}
                  numberOfLines={2}>
                  {lastmessage}
                </Text>
              </View>
            ) : lastMessage.last_message_type === 9 ? (
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: '#878787',
                    textAlignVertical: 'top',
                    flexWrap: 'wrap',
                    flexShrink: 1,
                  }}
                  numberOfLines={2}>
                  {lastMessage.sender_id == this.props?.user?.user.id && (
                    <>
                      {this.props.lastMessage.last_message_status == 0 ? (
                        <Icon
                          name="check"
                          size={15}
                          color="#979797"
                          style={{marginRight: '2%'}}
                        />
                      ) : this.props.lastMessage.last_message_status == 1 ? (
                        <Icon
                          name="done-all"
                          size={15}
                          color="#979797"
                          style={{marginRight: '10%'}}
                        />
                      ) : this.props.lastMessage.last_message_status == 2 ? (
                        <Icon
                          name="done-all"
                          size={15}
                          color="#547fff"
                          style={{marginRight: '2%'}}
                        />
                      ) : null}
                    </>
                  )}
                  {lastForwardmessage}
                </Text>
              </View>
            ) : lastMessage.last_message_type === 11 ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {this.props.lastMessage.sender_id ==
                  this.props.user?.user?.id && (
                  <>
                    {this.props.lastMessage.last_message_status == 0 ? (
                      <Icon
                        name="check"
                        size={15}
                        color="#979797"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 1 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#979797"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : this.props.lastMessage.last_message_status == 2 ? (
                      <Icon
                        name="done-all"
                        size={15}
                        color="#547fff"
                        style={{marginRight: '2%', marginTop: '1.5%'}}
                      />
                    ) : null}
                    <Text> </Text>
                  </>
                )}
                <FontAwesome name={'video'} size={12} color={'#878787'} />
                <Text
                  style={{
                    // marginLeft: '5%',
                    fontSize: 14,
                    fontFamily: 'Roboto-Regular',
                    color: '#878787',
                  }}>
                  {' '}
                  Video
                </Text>
              </View>
            ) : lastMessage.last_message_type === 10 ? (
              <View>
                {console.log(
                  'lastMessage',
                  JSON.parse(lastMessage.last_message),
                )}
                {/* <Text>dsdsds</Text> */}
                {JSON.parse(lastMessage.last_message).call_type == 1 ? (
                  <View style={styles.callinnerview}>
                    <Icon name={'phone-callback'} size={15} color={'#878787'} />
                    <Text style={styles.calltext}> Audio call</Text>
                  </View>
                ) : (
                  <View style={styles.callinnerview}>
                    <Icon
                      name={'missed-video-call'}
                      size={15}
                      color={'#878787'}
                    />
                    <Text style={styles.calltext}> Video call</Text>
                  </View>
                )}
              </View>
            ) : null}
          </>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  calltext: {
    color: '#878787',
  },
  callinnerview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    user: state.auth.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LastMessageType);
