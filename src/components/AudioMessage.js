import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator,
  Easing,
  Animated,
} from "react-native";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import Feather from "react-native-vector-icons/dist/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/dist/MaterialCommunityIcons";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import Slider from "react-native-slider-custom";

//Redux
import {
  setMediaOptionsOpen,
  setSickerOpen,
  setOnLongPress,
  setReplyState,
} from "../store/actions";
import { connect } from "react-redux";
import appConfig from "../utils/appConfig";
import { onDownload } from "../utils/regex";
import { Audio, getRealPath } from "react-native-compressor";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
class AudioMessage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recordSecs: 0,
      recordTime: "00:00",
      audioRecod: false,
      audioPath: `${appConfig.localPath}Audios/Sent`,
      isSending: false,
      recordSlidingValue: 0,
    };
    this.animatedValue = new Animated.Value(0);
    this.audioRecorderPlayer = new AudioRecorderPlayer();
  }

  animate(easing) {
    this.animatedValue.setValue(0);
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 1000,
      easing,
    }).start();
  }

  componentDidMount = () => {
    this.animate(Easing.bounce);
    if (Platform.OS == "ios") {
      this.onStartRecord();
    }
    onDownload
      .checkPermission()
      .then((isPermitted) => {
        if (isPermitted) {
          onDownload
            .checkDirectory(this.state.audioPath)
            .then((res) => {
              if (res) {
                this.onStartRecord();
              } else {
                onDownload
                  .makeNewDirectory(this.state.audioPath)
                  .then((isDirMade) => {
                    if (isDirMade) {
                      this.onStartRecord();
                    }
                  })
                  .catch((makeDirectoryError) => {
                    console.log("makeDirectoryError: ", makeDirectoryError);
                  });
              }
            })
            .catch((checkDirectoryError) => {
              console.log("checkDirectoryError: ", checkDirectoryError);
            });
        }
      })
      .catch((permissionError) => {
        console.log("permissionError: ", permissionError);
      });
  };

  onStartRecord = async () => {
    try {
      const path = Platform.select({
        ios: `srplive-1234.m4a`,
        android: `${this.state.audioPath}/1234.mp3`,
      });
      const uri = await this.audioRecorderPlayer.startRecorder(path);
      this.audioRecorderPlayer.addRecordBackListener((e) => {
        this.setState({
          recordSecs: e.currentPosition,
          recordTime:
            this.audioRecorderPlayer
              .mmssss(Math.floor(e.currentPosition))
              .toString()
              .split(":")[0] +
            ":" +
            this.audioRecorderPlayer
              .mmssss(Math.floor(e.currentPosition))
              .toString()
              .split(":")[1],
        });
        return;
      });
    } catch (err) {
      console.log(err);
    }
  };

  onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    this.setState({ recordSlidingValue: 0 });
    this.props.onCancelAudio();
  };

  renderCancelAudio() {
    return (
      <TouchableOpacity
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
        onPress={() => this.onStopRecord()}
      >
        <Text style={{ color: "#E77B7B" }}>Cancel</Text>
      </TouchableOpacity>
    );
  }

  onSendAudio = async () => {
    this.setState({ isSending: true });
    try {
      const result = await this.audioRecorderPlayer.stopRecorder();
      if (Platform.OS == "ios") {
        const result1 = await Audio.compress(result, { quality: "medium" });
        this.audioRecorderPlayer.removeRecordBackListener();
        let audioFile1 = {
          uri: `file:///${result1.split("//")[1]}`,
          name: "srplive-1234.m4a",
          type: `audio/${result1.split(".")[1]}`,
          duration: this.state.recordTime,
        };
        console.log("audioFile1", audioFile1);
        this.socketAPIRun(audioFile1);
      } else {
        let audioFile = {
          uri: result,
          name: result.toString().split("/")[
            result.toString().split("/").length - 1
          ],
          type: `audio/${
            result
              .toString()
              .split("/")
              [result.toString().split("/").length - 1].toString()
              .split(".")[
              result
                .toString()
                .split("/")
                [result.toString().split("/").length - 1].toString()
                .split(".").length - 1
            ]
          }`,
          duration: this.state.recordTime,
        };
        this.socketAPIRun(audioFile);
      }
    } catch (err) {
      console.log(err);
    }
  };

  socketAPIRun = (file) => {
    let token = this.props.user?.token;
    let formdata = new FormData();
    formdata.append("files[]", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
    formdata.append("upload_type", "audio");
    fetch("https://www.srplivehelp.com/api/send-files-2", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      body: formdata,
    })
      .then(async (res) => {
        return res.json();
      })
      .then((audio) => {
        this.setState({ isSending: false });
        let obj = {
          name: audio.data.audios[0].name,
          extenstion: audio.data.audios[0].extenstion,
          size: audio.data.audios[0].size,
          duration: file.duration,
        };
        this.props.onCancelAudio();
        this.props.sendAudioMessage(JSON.stringify(obj));
      })
      .catch((err) => {
        this.setState({ isSending: false });
        console.log("++ ", err);
      });
  };

  render() {
    let type = "simple";
    console.log("change", this.state.recordSlidingValue);
    const marginL = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 260],
    });
    return (
      // <View style={styles[type].container}>
      //   <View>
      //     <TextInput
      //       editable={false}
      //       style={styles[type].textInput}
      //       value={this.state.recordTime}
      //     />
      //     <View style={styles[type].pinIcon}>{this.renderCancelAudio()}</View>
      //   </View>
      //   <TouchableOpacity
      //     style={styles[type].micIcon}
      //     onPress={() => this.onSendAudio()}>
      //     <FontAwesome name={'paper-plane'} size={20} color="white" />
      //   </TouchableOpacity>
      // </View>
      // <View style={styles.mainWrapper}>
      //   <View style={styles.textInputWrapper}>
      //     <TextInput
      //       editable={false}
      //       value={this.state.recordTime}
      //       style={styles.inputField}
      //     />
      //   </View>

      //   <TouchableOpacity
      //     disabled={this.state.isSending}
      //     style={styles.buttonWrapper}
      //     onPress={() => this.onStopRecord()}
      //   >
      //     <FontAwesome name={"times"} size={25} color="red" />
      //   </TouchableOpacity>

      //   {this.state.isSending ? (
      //     <View style={styles.buttonWrapper}>
      //       <ActivityIndicator size={"small"} color={"blue"} />
      //     </View>
      //   ) : (
      //     <TouchableOpacity
      //       style={styles.buttonWrapper}
      //       onPress={() => this.onSendAudio()}
      //     >
      //       <FontAwesome name={"paper-plane"} size={25} color="#6B93F9" />
      //     </TouchableOpacity>
      //   )}
      // </View>
      <View style={styles.sliderContainer}>
        <View style={{ width: "75%" }}>
          <Slider
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor="transparent"
            maximumTrackTintColor="transparent"
            onValueChange={(e) => this.setState({ recordSlidingValue: e })}
            onSlidingStart={(e) => console.log("START", e)}
            onSlidingComplete={(e) => console.log("END", e)}
            trackStyle={styles.slidertrack}
            customThumb={
              <View
                style={[
                  styles.customThumbBg,
                  {
                    backgroundColor:
                      this.state.recordSlidingValue < 50
                        ? "#DFB499"
                        : "#D82926",
                  },
                ]}
              >
                {this.state.recordSlidingValue < 50 ? (
                  <Animated.View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "red",
                      marginLeft: marginL,
                    }}
                  >
                    <Feather name="mic" size={22} color={"white"} />
                  </Animated.View>
                ) : (
                  <Feather name="trash" size={22} color={"white"} />
                )}
              </View>
            }
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ marginRight: 5 }}>{this.state.recordTime}</Text>
          <MaterialCommunityIcons
            name="circle-double"
            size={30}
            color="red"
            onPress={this.onStopRecord}
          />
        </View>
      </View>
    );
  }
}

const styles = {
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
  // SLIDER
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: "white",
  },
  slidertrack: {
    backgroundColor: "transparent",
  },
  customThumbBg: {
    width: 35,
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  simple: StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
    textInput: {
      backgroundColor: "white",
      height: Platform.OS == "android" ? 55 : 50,
      width: windowWidth * 0.825,
      marginLeft: "2%",
      marginRight: "1.5%",
      borderRadius: 30,
      paddingLeft: "6%",
      paddingTop: Platform.OS == "ios" ? 15 : 15,
      paddingBottom: Platform.OS == "ios" ? 15 : 15,
      fontSize: 16,
    },
    cameraIcon: {
      position: "absolute",
      right: 60,
      top: 15,
    },
    pinIcon: {
      position: "absolute",
      right: 30,
      top: 15,
    },
    micIcon: {
      backgroundColor: "#018679",
      height: 50,
      width: 50,
      borderRadius: 50 / 2,
      alignItems: "center",
      justifyContent: "center",
    },
    mediaOpenDesign: {
      height: 200,
      marginTop: -200,
    },
  }),
  reply: StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
    textInput: {
      backgroundColor: "white",
      height: 50,
      width: "86%",
      marginHorizontal: "2%",
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      paddingLeft: "5%",
    },
    cameraIcon: {
      position: "absolute",
      right: 60,
      top: 85,
    },
    pinIcon: {
      position: "absolute",
      right: 30,
      top: 85,
    },
    micIcon: {
      backgroundColor: "#018679",
      height: 50,
      width: 50,
      borderRadius: 50 / 2,
      alignItems: "center",
      justifyContent: "center",
    },
    mediaOpenDesign: {
      height: 200,
      marginTop: -300,
    },
  }),
};

const mapStateToProps = (state) => {
  return {
    mediaOptionsOpen: state.stateHandler.mediaOptionsOpen,
    stickerOpen: state.stateHandler.stickerOpen,
    replyState: state.stateHandler.replyState,
    user: state.auth.user,
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AudioMessage);
