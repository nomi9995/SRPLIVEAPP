import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Text,
  Platform,
  Dimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { VESDK, VideoEditorModal } from "react-native-videoeditorsdk";
import FastImage from "react-native-fast-image";
import MaterialCommunityIcons from "react-native-vector-icons/dist/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import Octicons from "react-native-vector-icons/dist/Octicons";
import PhotoEditor from "@baronha/react-native-photo-editor";
import PagerView from "react-native-pager-view";
import Video from "react-native-video-controls";
import { Thumbnail } from "react-native-thumbnail-video";
import { ProcessingManager } from "react-native-video-processing";
import { PESDK, PhotoEditorModal } from "react-native-photoeditorsdk";
import ProgressCircle from "react-native-progress-circle";

//Redux
import { connect } from "react-redux";
import {
  setImagePreview,
  setMediaOptionsOpen,
  setMediaType,
  setMediaUploadState,
  setStatusState,
} from "../store/actions";

// Components
import PlayerAndTrimmer from "./PlayerAndTrimmer";

const { width, height } = Dimensions.get("window");

class MediaUploadPreview extends React.Component {
  constructor(props) {
    super(props);
    this.pagerRef = React.createRef();
    this.playerRef = React.createRef(null);
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
      loader: false,
      galleryCallback: props?.galleryCallback,
      selected: 0,
    };
  }

  sendHandler = (caption) => {
    this.props.onSetMediaUploadState(true);
    this.props.onUploadMedia(this.state.selectedMedia, caption);
  };

  exportButton = (val) => {
    let editVideo = [...this.state.selectedMedia];

    if (val.hasChanges === true) {
      editVideo[0].name = val.video.substr(39, 30);
      editVideo[0].source = val.video;
      editVideo[0].type = `video/${val.video.substr(65, 4)}`;
      editVideo[0].uri = val.video;

      this.setState({ selectedMedia: editVideo });
      this.sendHandler(""), this.crossButton();
    } else {
      editVideo[0].name = val.video.substr(70, 23);
      editVideo[0].source = val.video;
      editVideo[0].type = `video/${val.video.substr(90, 3)}`;
      editVideo[0].uri = val.video;

      this.setState({ selectedMedia: editVideo });
      this.sendHandler(""), this.crossButton();
    }
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
        path: selectedMedia[page].source
          ? selectedMedia[page].source
          : selectedMedia[page].uri,
      };

      const result = await PhotoEditor.open(options);
      if (selectedMedia[page].source) selectedMedia[page].source = result;
      else selectedMedia[page].uri = result;
      this.setState({ selectedMedia: selectedMedia });
    } else {
      // this.trimVideo();
      if (typeof trimmedUrl === "string") {
        selectedMedia[page].source = trimmedUrl;
        this.setState({ selectedMedia: selectedMedia, doTrimming: false });
      } else {
        this.setState({
          doTrimming: true,
          playVideo: true,
        });
      }
    }
  };

  getVideoInfo = () => {
    this.videoPlayerRef
      .getVideoInfo()
      .then((info) => this.setState({ endTime: info.duration }))
      .catch(console.warn);
  };

  getPreviewImageForSecond = (second) => {
    const maximumSize = { width: 640, height: 1024 }; // default is { width: 1080, height: 1080 } iOS only
    this.videoPlayerRef
      .getPreviewForSecond(second, maximumSize) // maximumSize is iOS only
      .then((base64String) =>
        console.log("This is BASE64 of image", base64String)
      )
      .catch(console.warn);
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
      selectedMedia[page].uri = data;
      this.setState({ selectedMedia: selectedMedia });
    });
  };

  handleMediaType = (type) => {
    this.state.galleryCallback(type);
  };

  render() {
    let caption = "";
    const { progressData } = this.props;
    const { page, selectedMedia, playVideo, doTrimming } = this.state;
    return (
      <>
        {this.props.mediaUploadState && (
          <View
            style={{
              position: "absolute",
              top: "43%",
              bottom: "43%",
              right: "10%",
              left: "10%",
              backgroundColor: "#fff",
              zIndex: 1,
              borderRadius: 10,
              padding: 5,
            }}
          >
            <View
              style={{
                height: "100%",
                width: "100%",
                flexDirection: "row",
                // backgroundColor: "grey",
                borderRadius: 5,
                alignItems: "center",
                // justifyContent: "center",
                paddingHorizontal: 10,
              }}
            >
              <ProgressCircle
                percent={parseInt(progressData.percentage)}
                radius={40}
                borderWidth={4}
                color="#42ba96"
                shadowColor="#ddd"
                bgColor="#fff"
              >
                <Text style={{ fontSize: 18 }}>
                  {parseInt(progressData.percentage)} %
                </Text>
              </ProgressCircle>

              <View style={{ marginLeft: 25 }}>
                <Text
                  style={{
                    fontSize: 18,
                    lineHeight: 32,
                    fontWeight: "bold",
                    letterSpacing: 1,
                  }}
                >
                  Sending...
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    lineHeight: 32,
                  }}
                >
                  {progressData.loaded.toFixed(2)} /{" "}
                  {progressData.total.toFixed(2)} MB
                </Text>
              </View>
            </View>
          </View>
        )}
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            opacity: this.props.mediaUploadState ? 0.8 : 1,
          }}
        >
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
                      source={{ uri: media.source ? media.source : media.uri }}
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
                      <VideoEditorModal visible={true} video={media.uri} />
                      // <Video
                      //   source={{ uri: media.uri }}
                      //   paused={playVideo}
                      //   controls={true}
                      //   repeat={true}
                      //   ignoreSilentSwitch={"ignore"}
                      //   playInBackground={false}
                      //   resizeMode={"contain"}
                      //   style={{
                      //     height: "100%",
                      //     width: "100%",
                      //   }}
                      // />
                    )
                  ) : null}
                </View>
              );
            })}
          </PagerView>

          {!doTrimming && (
            <View style={{ flex: 0.07, flexDirection: "row" }}>
              <View
                style={{
                  flexDirection: "row",
                  height: 60,
                  marginHorizontal: 5,
                  // marginTop: 10,
                  bottom: selectedMedia.length === 1 ? -20 : 0,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flex: 0.88,
                    alignItems: "center",
                    marginVertical: 5.5,
                    backgroundColor: "#fff",
                    borderRadius: 25,
                    width: "100%",
                  }}
                >
                  <TouchableOpacity
                    // activeOpacity={1}
                    onPress={() => this.handleMediaType("gallery")}
                  >
                    <MaterialCommunityIcons
                      name="image-multiple-outline"
                      size={20}
                      color="grey"
                      style={{ marginLeft: 12, marginRight: 10 }}
                    />
                  </TouchableOpacity>
                  {!this.props.statusState && (
                    <TextInput
                      placeholderTextColor={"grey"}
                      placeholder="Write a Caption!"
                      onChangeText={(val) => (caption = val)}
                      style={{ flex: 1, fontSize: 16 }}
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
                      borderRadius: 50 / 2,
                      height: 50,
                      width: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 10,
                    }}
                  >
                    <FontAwesome5
                      name={"paper-plane"}
                      size={20}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {selectedMedia.length > 1 && (
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    bottom: 4,
                    position: "absolute",
                  }}
                >
                  {selectedMedia.map((media, index) => {
                    let type = media.type.split("/")[0];
                    return (
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          this.pagerRef.setPage(index);
                          this.setState({ selected: index });
                        }}
                        key={index}
                        style={{
                          width: 60,
                          height: 60,
                          borderWidth: 2,
                          borderColor:
                            this.state.selected === index ? "cyan" : "#000",
                        }}
                      >
                        {type === "image" ? (
                          <FastImage
                            source={{
                              uri: media.source ? media.source : media.uri,
                            }}
                            style={{ height: "100%", width: "100%" }}
                            resizeMode={"contain"}
                          />
                        ) : type === "video" ? (
                          <Video
                            disablePlayPause={true}
                            disableSeekbar={true}
                            disableBack={true}
                            disableFullscreen={true}
                            disableVolume={true}
                            disableTimer={true}
                            controlTimeout={0}
                            source={{ uri: media.uri }}
                            paused={playVideo}
                            ignoreSilentSwitch={"ignore"}
                            playInBackground={false}
                            resizeMode={"contain"}
                            style={{
                              height: "100%",
                              width: "100%",
                            }}
                          />
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </>
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
    onSetMediaOptionsOpen: (data) => {
      dispatch(setMediaOptionsOpen(data));
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
