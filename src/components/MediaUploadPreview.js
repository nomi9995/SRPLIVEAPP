import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Text,
  Platform,
} from "react-native";

import FastImage from "react-native-fast-image";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import PhotoEditor from "@baronha/react-native-photo-editor";
import PagerView from "react-native-pager-view";
import Video from "react-native-video";
import { ProcessingManager } from "react-native-video-processing";

//Redux
import { connect } from "react-redux";
import {
  setImagePreview,
  setMediaType,
  setMediaUploadState,
  setStatusState,
} from "../store/actions";

// Components
import PlayerAndTrimmer from "./PlayerAndTrimmer";

class MediaUploadPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      selectedMedia: props?.selectedMedia,
      position: 0,
      images: [],
      currentTime: 0,
      startTime: 0,
      endTime: 0,
      viewHeight: 0,
      playVideo: true,
      doTrimming: false,
    };
  }

  sendHandler = (caption) => {
    this.props.onSetMediaUploadState(true);
    this.props.onUploadMedia(this.state.selectedMedia, caption);
  };

  crossButton = () => {
    if (this.props.statusState === true) {
      this.props.onSetImagePreview(false);
      this.props.onSetMediaType(null);
      this.props.onSetStatus(false);
      this.props.onSetMediaUploadState(false);
    } else if (this.props.mediaType === "document") {
      this.props.onSetMediaType(null);
    } else if (this.state.doTrimming) {
      this.setState({ doTrimming: false });
    } else {
      this.setState({ playVideo: true });
      this.props.onSetImagePreview(false);
      this.props.onSetMediaType(null);
      this.props.onSetMediaUploadState(false);
    }
  };

  editButton = async (trimmedUrl = "") => {
    const { page, selectedMedia } = this.state;
    let type = selectedMedia[page].type.split("/")[0];
    if (type === "image") {
      const options = {
        path: selectedMedia[page].uri,
      };

      const result = await PhotoEditor.open(options);
      selectedMedia[page].uri = result;
      this.setState({ selectedMedia: selectedMedia });
    } else {
      this.trimVideo();
      // if (typeof trimmedUrl === "string") {
      //   selectedMedia[page].uri = trimmedUrl;
      //   this.setState({ selectedMedia: selectedMedia, doTrimming: false });
      // } else {
      //   this.setState({
      //     doTrimming: true,
      //     playVideo: true,
      //   });
      // }
    }
  };

  trimVideo = () => {
    const { page, selectedMedia } = this.state;
    const options = {
      startTime: 15,
      endTime: 35,
      quality:
        Platform.OS == "ios"
          ? VideoPlayer.Constants.quality.QUALITY_1280x720
          : "",
      saveToCameraRoll: true,
      saveWithCurrentDate: false,
    };

    console.log("options: ", selectedMedia[page].uri);

    ProcessingManager.trim(selectedMedia[page].uri, options).then((data) => {
      console.log("data: ", data);
    });
  };

  render() {
    let caption = "";
    const { page, selectedMedia, playVideo, doTrimming } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        {!doTrimming && (
          <View
            style={{
              flex: 0.07,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              onPress={this.crossButton}
              disabled={this.props.mediaUploadState}
              style={{
                flex: 0.5,
                justifyContent: "center",
                paddingLeft: 10,
              }}
            >
              <FontAwesome name="times" size={30} color={"#fff"} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.editButton}
              disabled={this.props.mediaUploadState}
              style={{
                flex: 0.5,
                justifyContent: "center",
                paddingRight: 10,
                alignItems: "flex-end",
              }}
            >
              <FontAwesome name="edit" size={25} color={"#fff"} />
            </TouchableOpacity>
          </View>
        )}

        <PagerView
          keyboardDismissMode={"on-drag"}
          transitionStyle={"curl"}
          style={{ flex: 0.86 }}
          onPageSelected={async (e) => {
            await this.setState({ page: e.nativeEvent.position });
          }}
        >
          {selectedMedia.map((media, index) => {
            let type = media.type.split("/")[0];
            return (
              <View
                key={index}
                style={{
                  flex: 1,
                }}
              >
                {type === "image" ? (
                  <FastImage
                    source={{ uri: media.uri }}
                    style={{ height: "100%", width: "100%" }}
                    resizeMode={"contain"}
                  />
                ) : type === "video" ? (
                  doTrimming ? (
                    <PlayerAndTrimmer
                      url={media.uri}
                      tickBtn={(trimmedUrl) => {
                        this.editButton(trimmedUrl);
                      }}
                      crossButton={() => {
                        this.setState({ doTrimming: false });
                      }}
                    />
                  ) : (
                    <Video
                      source={{ uri: media.uri }}
                      paused={playVideo}
                      controls={true}
                      repeat={true}
                      ignoreSilentSwitch={"ignore"}
                      playInBackground={false}
                      resizeMode={"contain"}
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  )
                ) : null}
              </View>
            );
          })}
        </PagerView>

        {!doTrimming &&
          (this.props.mediaUploadState ? (
            <View style={{ flex: 0.07, flexDirection: "row" }}>
              <ActivityIndicator size="large" color="#008069" />
              <Text style={{ color: "white", fontSize: 20 }}>
                {parseInt(this.props.progressData)} %
              </Text>
            </View>
          ) : (
            <View style={{ flex: 0.07, flexDirection: "row" }}>
              <View
                style={{
                  flex: 0.9,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                }}
              >
                {!this.props.statusState && (
                  <TextInput
                    placeholder="Write a Caption!"
                    onChangeText={(val) => (caption = val)}
                    style={{
                      borderRadius: 25,
                      backgroundColor: "#fff",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                )}
              </View>
              <View
                style={{
                  flex: 0.1,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => this.sendHandler(caption)}
                  style={{
                    backgroundColor: "#018679",
                    borderRadius: 50,
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome name={"paper-plane"} size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    imagePreview: state.stateHandler.imagePreview,
    mediaType: state.stateHandler.mediaType,
    mediaUploadState: state.stateHandler.mediaUploadState,
    statusState: state.stateHandler.statusState,
    previewType: state.stateHandler.previewType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetMediaType: (data) => {
      dispatch(setMediaType(data));
    },
    onSetImagePreview: (data) => {
      dispatch(setImagePreview(data));
    },
    onSetMediaUploadState: (data) => {
      dispatch(setMediaUploadState(data));
    },
    onSetStatus: (data) => {
      dispatch(setStatusState(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaUploadPreview);

const styles = StyleSheet.create({
  bgView: {
    flex: 1,
    // backgroundColor: 'black',
  },
  crossIcon: {
    color: "white",
    fontSize: 30,
    alignSelf: "flex-end",
    paddingHorizontal: "5%",
    paddingTop: "5%",
  },
  footerFlex: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "flex-end",
  },
  footerLoader: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    height: 45,
    width: "83%",
    backgroundColor: "white",
    marginHorizontal: "2%",
    borderRadius: 30,
    paddingHorizontal: 10,
  },

  micIcon: {
    backgroundColor: "#018679",
    height: 45,
    width: 45,
    borderRadius: 50 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  keyboardContainer: {
    flex: 1,
    marginTop: "10%",
  },
  inner: {
    flex: 1,
    // justifyContent: 'space-around',
  },
  fileUploadContainer: {
    flex: 1,
    // alignItems: 'center',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
  },
  fileUploadView: {
    // alignItems: 'center',
    // height: '30%',
    // margin: '2%',
    // width: '46%',
  },
  fileUpload: {
    backgroundColor: "white",
    borderRadius: 5,
    width: "70%",
    height: "70%",
  },
  fileUploadIcon: {
    color: "#06A88E",
    fontSize: 40,
    padding: "3%",
    alignSelf: "center",
    marginTop: "30%",
    fontFamily: "Roboto-Regular",
  },
  fileUploadText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    width: 100,
  },
  bottomFooter: {
    overflow: "hidden",
    marginRight: 10,
  },
  moreContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  moreText: {
    color: "#fff",
    fontSize: 30,
  },
});
