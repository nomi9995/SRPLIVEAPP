import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from "react-native";
import FastImage from "react-native-fast-image";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";

//Redux
import {
  setOnLongPress,
  setReplyState,
  setMessageEdit,
  setMessageText,
} from "../store/actions";
import { connect } from "react-redux";

class ReplySelectedMessage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    BackHandler.addEventListener("hardwareBackPress", this.backHandler);
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener("hardwareBackPress", this.backHandler);
  };

  backHandler = () => {
    this.onPressCross();
    return true;
  };

  onPressCross = () => {
    this.props.onSetReplyState(false);
    this.props.onSetMessageEdit(false);
    this.props.onSetMessageText(null);
    this.props.onSetOnLongPress([]);
  };

  render() {
    const { longPress } = this.props;
    let parsed, nestedParsed, IS_JSON;
    if (typeof longPress[0]?.message == "string") {
      // parsed = JSON.parse(longPress[0]?.message);
      IS_JSON = true;
      try {
        parsed = JSON.parse(longPress[0]?.message);
      } catch (err) {
        IS_JSON = false;
      }
    }

    // if (typeof parsed.message == "string") {
    //   IS_JSON = true;
    //   try {
    //     nestedParsed = JSON.parse(parsed.message);
    //   } catch (err) {
    //     IS_JSON = false;
    //   }
    // }
    console.log("Actual data", longPress[0]);
    console.log("Prased", parsed);

    return (
      <View style={styles.container}>
        <View style={styles.mainWrapper}>
          <View style={styles.leftWrapper}>
            <Text style={styles.nameText}>
              {longPress[0]?.user._id === 2 ? "You" : longPress[0]?.first_name}
            </Text>

            {longPress[0]?.type === 1 ? (
              <Text style={styles.plainMsgText} numberOfLines={1}>
                {longPress[0]?.message}
              </Text>
            ) : (
              parsed?.type === 1 && (
                <Text style={styles.plainMsgText} numberOfLines={1}>
                  {parsed.message}
                </Text>
              )
            )}

            {(longPress[0]?.type === 2 || parsed?.type === 2) && (
              <View style={styles.mediaMsgWrapper}>
                <FontAwesome name={"image"} size={20} color={"gray"} />
                <Text style={styles.mediaMsgText}>Photo</Text>
              </View>
            )}

            {(longPress[0]?.type === 3 || parsed?.type === 3) && (
              <View style={styles.mediaMsgWrapper}>
                <FontAwesome name={"image"} size={20} color={"gray"} />
                <Text style={styles.mediaMsgText}>GIF</Text>
              </View>
            )}

            {longPress[0]?.type === 4 ? (
              <FastImage
                source={{
                  uri: `https://www.srplivehelp.com/media/stickers/${longPress[0]?.message}`,
                }}
                style={{ paddingVertical: 5, height: 40, width: 40 }}
              />
            ) : (
              parsed?.type === 4 && (
                <FastImage
                  source={{
                    uri: `https://www.srplivehelp.com/media/stickers/${parsed?.message}`,
                  }}
                  style={{ paddingVertical: 5, height: 40, width: 40 }}
                />
              )
            )}

            {(longPress[0]?.type === 5 || parsed?.type === 5) && (
              <View style={styles.mediaMsgWrapper}>
                <FontAwesome name={"link"} size={20} color={"gray"} />
                <Text style={styles.mediaMsgText}>Link</Text>
              </View>
            )}

            {(longPress[0]?.type === 6 || parsed?.type === 6) && (
              <View style={styles.mediaMsgWrapper}>
                <FontAwesome name={"file"} size={20} color={"gray"} />
                <Text style={styles.mediaMsgText}>File</Text>
              </View>
            )}

            {(longPress[0]?.type === 7 || parsed?.type === 7) && (
              <View style={styles.mediaMsgWrapper}>
                <FontAwesome name={"headphones"} size={20} color={"gray"} />
                <Text style={styles.mediaMsgText}>Audio</Text>
              </View>
            )}

            {longPress[0]?.type === 8 && (
              <>
                {parsed?.new_message?.new_type === 1 && (
                  <Text style={styles.plainMsgText} numberOfLines={1}>
                    {parsed.new_message.new_content}
                  </Text>
                )}
                {parsed?.new_message?.new_type === 2 && (
                  <View style={styles.mediaMsgWrapper}>
                    <FontAwesome name={"image"} size={20} color={"gray"} />
                    <Text style={styles.mediaMsgText}>Photo</Text>
                  </View>
                )}
                {parsed?.new_message?.new_type === 3 && (
                  <View style={styles.mediaMsgWrapper}>
                    <FontAwesome name={"image"} size={20} color={"gray"} />
                    <Text style={styles.mediaMsgText}>GIF</Text>
                  </View>
                )}
                {parsed?.new_message?.new_type === 5 && (
                  <View style={styles.mediaMsgWrapper}>
                    <FontAwesome name={"link"} size={20} color={"gray"} />
                    <Text style={styles.mediaMsgText}>Link</Text>
                  </View>
                )}
                {parsed?.new_message?.new_type === 6 && (
                  <View style={styles.mediaMsgWrapper}>
                    <FontAwesome name={"file"} size={20} color={"gray"} />
                    <Text style={styles.mediaMsgText}>File</Text>
                  </View>
                )}
                {parsed?.new_message?.new_type === 7 && (
                  <View style={styles.mediaMsgWrapper}>
                    <FontAwesome name={"headphones"} size={20} color={"gray"} />
                    <Text style={styles.mediaMsgText}>Audio</Text>
                  </View>
                )}
                {parsed?.new_message?.new_type === 11 && (
                  <View style={styles.mediaMsgWrapper}>
                    <FontAwesome name={"video"} size={20} color={"gray"} />
                    <Text style={styles.mediaMsgText}>Video</Text>
                  </View>
                )}
              </>
            )}

            {(longPress[0]?.type === 11 || parsed?.type === 11) && (
              <View style={styles.mediaMsgWrapper}>
                <FontAwesome name={"video"} size={20} color={"gray"} />
                <Text style={styles.mediaMsgText}>Video</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.closeBtnWraper}
            onPress={() => this.onPressCross()}
          >
            <FontAwesome name={"times"} size={20} color="lightgrey" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingBottom: 1,
  },

  mainWrapper: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    flexDirection: "row",
    paddingLeft: 20,
    borderRadius: 12,
    marginTop: 10,
  },

  leftWrapper: {
    flex: 0.9,
  },

  nameText: {
    paddingVertical: 5,
    color: "#057e6f",
  },

  plainMsgText: {
    paddingVertical: 5,
  },

  mediaMsgWrapper: {
    paddingVertical: 5,
    flexDirection: "row",
  },

  mediaMsgText: {
    marginLeft: 5,
  },

  closeBtnWraper: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const mapStateToProps = (state) => {
  return {
    longPress: state.messages.longPress,
    replyState: state.stateHandler.replyState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetOnLongPress: (data) => {
      dispatch(setOnLongPress(data));
    },
    onSetReplyState: (data) => {
      dispatch(setReplyState(data));
    },
    onSetMessageEdit: (data) => {
      dispatch(setMessageEdit(data));
    },
    onSetMessageText: (text) => {
      dispatch(setMessageText(text));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReplySelectedMessage);
