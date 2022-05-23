import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import Feather from "react-native-vector-icons/dist/Feather";
import { socket } from "../../../sockets/connection";

//Redux
import {
  setMediaOptionsOpen,
  setSickerOpen,
  setOnLongPress,
  setReplyState,
  setMediaType,
  setMessageText,
} from "../../../store/actions";

import { connect } from "react-redux";

//Components
import ReplySelectedMessage from "../../../components/ReplySelectedMessage";
import AudioMessage from "../../../components/AudioMessage";

class MessageInputToolBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      changeText: true,
      audioRecod: false,
      isFirst: true,
    };
  }

  componentDidMount = () => {
    setInterval(() => {
      let len = this.props.messageText.length;
      setTimeout(() => {
        let lenAgain = this.props.messageText.length;
        if (len == lenAgain) {
          this.turnOffSocket();
        }
      }, 3000);
    }, 5000);
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.messageText != null) {
      if (prevProps.messageText.length > this.props.messageText.length) {
        this.turnOffSocket();
      }
    }
  };

  turnOnSocket = () => {
    let obj = {
      typing_user: this.props.user?.user.id,
      active_room: null,
      active_user: this.props.selectedUser.user_id,
    };
    socket.emit("typing_on", JSON.stringify(obj));
  };

  turnOffSocket = () => {
    let typing_off = {
      typing_user: this.props.user?.user.id,
      active_room: null,
      active_user: this.props.selectedUser.user_id,
    };
    socket.emit("typing_off", JSON.stringify(typing_off));
  };

  renderMediaOptions() {
    return <View>{this.props.renderMediaOptions("mediaOptionOpen")}</View>;
  }

  renderStickers() {
    return <View>{this.props.renderMediaOptions("stickers")}</View>;
  }

  onChangeText = (text) => {
    if (text.length > this.props.messageText.length) this.turnOnSocket();

    this.props.onSetMessageText(text);
  };

  render() {
    const { longPress } = this.props;

    if (longPress.length !== 0 && this.props.messageEdit) {
      if (longPress[0].type === 1 && this.state.changeText) {
        this.props.onSetMessageText(longPress[0].message);
        this.setState({ changeText: false });
      } else if (longPress[0].type === 8) {
        let msg = JSON.parse(longPress[0].message).new_message;
        if (msg.new_type === 1 && this.state.changeText) {
          this.props.onSetMessageText(msg.new_content);
          this.setState({ changeText: false });
        }
      }
    } else {
      this.setState({ changeText: true });
    }

    return (
      <View style={styles.container}>
        <View style={{ position: "absolute", bottom: 0, zIndex: 1 }}>
          {this.props.mediaOptionsOpen && this.renderMediaOptions()}
        </View>
        {this.props.stickerOpen && this.renderStickers()}
        {this.state.audioRecod ? (
          <AudioMessage
            onCancelAudio={() => this.setState({ audioRecod: false })}
            sendAudioMessage={(data) => this.props.onSendAudioMessage(data)}
          />
        ) : (
          <View style={styles.container}>
            {this.props.replyState && <ReplySelectedMessage />}
            {!this.state.audioRecod && (
              <View style={styles.mainWrapper}>
                <View style={styles.textInputWrapper}>
                  <TextInput
                    placeholder="Type Here"
                    value={this.props.messageText}
                    placeholderTextColor={"grey"}
                    multiline={true}
                    onChangeText={(text) => this.onChangeText(text)}
                    style={styles.inputField}
                    maxLength={999}
                  />
                </View>

                <TouchableOpacity
                  style={styles.buttonWrapper}
                  onPress={() => {
                    Keyboard.dismiss();
                    if (this.props.mediaOptionsOpen) {
                      this.props.onSetMediaOptionsOpen(false);
                    } else if (this.props.stickerOpen) {
                      this.props.onSetSickerOpen(false);
                    } else if (!this.props.mediaOptionsOpen) {
                      this.props.onSetMediaOptionsOpen(true);
                    }
                  }}
                >
                  <Feather name={"plus"} size={30} color="#6B93F9" />
                </TouchableOpacity>

                {(this.props.messageText === null ||
                  this.props.messageText.trim() === "") &&
                !this.props.replyState ? (
                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() => this.setState({ audioRecod: true })}
                  >
                    <Feather name={"mic"} size={25} color="#6B93F9" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.buttonWrapper}
                    onPress={() => {
                      this.turnOffSocket();

                      if (this.props.replyState && !this.props.messageEdit) {
                        if (this.props.messageText.trim().length < 1000) {
                          this.props.onSendReplyMessage(
                            this.props.messageText.trim()
                          );
                          this.props.onSetMessageText("");
                        } else {
                          Alert.alert(
                            "Sorry",
                            `Sorry, Your message is too long!`
                          );
                        }
                      } else {
                        if (this.props.messageText.trim().length < 1000) {
                          this.props.onSendTextMessage(
                            this.props.messageText.trim()
                          );
                          this.props.onSetMessageText("");
                        } else {
                          Alert.alert(
                            "Sorry",
                            `Sorry, Your message is too long!`
                          );
                        }
                      }
                    }}
                  >
                    <FontAwesome
                      name={"paper-plane"}
                      size={25}
                      color="#6B93F9"
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
  },

  mainWrapper: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },

  textInputWrapper: {
    flex: 0.8,
  },

  inputField: {
    color: "black",
    borderWidth: 1,
    borderColor: "#f1f1f1",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    // textAlignVertical: 'center',
    maxHeight: 80,
  },

  buttonWrapper: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
};

const mapStateToProps = (state) => {
  return {
    mediaOptionsOpen: state.stateHandler.mediaOptionsOpen,
    stickerOpen: state.stateHandler.stickerOpen,
    replyState: state.stateHandler.replyState,
    user: state.auth.user,
    longPress: state.messages.longPress,
    messageEdit: state.stateHandler.messageEdit,
    messageText: state.stateHandler.messageText,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetMediaOptionsOpen: (data) => {
      dispatch(setMediaOptionsOpen(data));
    },
    onSetSickerOpen: (data) => {
      dispatch(setSickerOpen(data));
    },
    onSetOnLongPress: (data) => {
      dispatch(setOnLongPress(data));
    },
    onSetReplyState: (data) => {
      dispatch(setReplyState(data));
    },
    onSetMediaType: (data) => {
      dispatch(setMediaType(data));
    },
    onSetMessageText: (text) => {
      dispatch(setMessageText(text));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageInputToolBar);
