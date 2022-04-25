import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  ActivityIndicator,
} from "react-native";

import { VESDK } from "react-native-videoeditorsdk";
import FastImage from "react-native-fast-image";
import MaterialCommunityIcons from "react-native-vector-icons/dist/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import Octicons from "react-native-vector-icons/dist/Octicons";
import PagerView from "react-native-pager-view";
import Video from "react-native-video-controls";
import SmallVideo from "react-native-video";
import { PESDK } from "react-native-photoeditorsdk";
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
      loader: false,
      galleryCallback: props?.galleryCallback,
      selected: 0,
      caption: "",
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedMedia.length !== this.props.selectedMedia.length) {
      this.setState({ selectedMedia: this.props.selectedMedia });
    }
  }

  sendHandler = (caption) => {
    console.log("caption", caption);
    this.props.onSetMediaUploadState(true);
    this.props.onUploadMedia(this.state.selectedMedia, caption);
  };

  exportButton = (val) => {
    let editVideo = [...this.state.selectedMedia];

    if (val.hasChanges === true) {
      editVideo[0].name = val.video.split("/")[val.video.split("/").length - 1];
      editVideo[0].source = val.video;
      editVideo[0].type = `video/${
        val.video.split("/")[val.video.split("/").length - 1].split(".")[1]
      }`;
      editVideo[0].uri = val.video;

      this.setState({ selectedMedia: editVideo });
      // this.sendHandler(""), this.crossButton();
    } else {
      editVideo[0].name = val.video.split("/")[val.video.split("/").length - 1];
      editVideo[0].source = val.video;
      editVideo[0].type = `video/${
        val.video.split("/")[val.video.split("/").length - 1].split(".")[1]
      }`;
      editVideo[0].uri = val.video;

      this.setState({ selectedMedia: editVideo });
      // this.sendHandler(""), this.crossButton();
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
      let path = selectedMedia[page].source
        ? selectedMedia[page].source
        : selectedMedia[page].uri;
      const result = await PESDK.openEditor(path);

      if (selectedMedia[page].source) selectedMedia[page].source = result.image;
      else selectedMedia[page].uri = result.image;
      this.setState({ selectedMedia: selectedMedia });
    } else {
      let path = selectedMedia[page].uri;
      const result = await VESDK.openEditor(path);

      if (selectedMedia[page].source) selectedMedia[page].source = result.video;
      else selectedMedia[page].uri = result.video;
      // this.setState({ selectedMedia: selectedMedia });
      this.exportButton(result);
    }
  };

  handleMediaType = (type) => {
    this.state.galleryCallback(type);
  };

  render() {
    // let caption = "";
    const { progressData, isCompressing } = this.props;
    const { page, selectedMedia, playVideo } = this.state;
    return (
      <>
        {this.props.mediaUploadState && (
          <View style={styles.mediaUploadModelContainer}>
            <View style={styles.progressCircleContainer}>
              {isCompressing ? (
                <ActivityIndicator size={"large"} color={"#42ba96"} />
              ) : parseInt(progressData.percentage) == 100 ? (
                <ActivityIndicator size={"large"} color={"#42ba96"} />
              ) : (
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
              )}

              <View style={{ marginLeft: 25 }}>
                {isCompressing ? (
                  <Text style={styles.sendingText}>Compressing...</Text>
                ) : (
                  <Text style={styles.sendingText}>Sending...</Text>
                )}
                {!isCompressing && (
                  <Text style={styles.sendingProgressText}>
                    {progressData.loaded.toFixed(2)} /{" "}
                    {progressData.total.toFixed(2)} MB
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        <View
          style={[
            styles.contentContainer,
            {
              opacity: this.props.mediaUploadState ? 0.8 : 1,
            },
          ]}
        >
          <View style={styles.headerContentContainer}>
            <TouchableOpacity
              onPress={this.crossButton}
              disabled={this.props.mediaUploadState}
              style={styles.crossBtn}
            >
              <Ionicons name="close" size={30} color={"#fff"} />
            </TouchableOpacity>
            {selectedMedia.length > 1 && (
              <TouchableOpacity
                onPress={() => alert("Delete")}
                disabled={this.props.mediaUploadState}
                style={styles.trashBtn}
              >
                <Ionicons name={"trash-outline"} size={27} color={"white"} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={this.editButton}
              disabled={this.props.mediaUploadState}
              style={styles.pencilBtn}
            >
              <Octicons name="pencil" size={25} color={"#fff"} />
            </TouchableOpacity>
          </View>

          <PagerView
            ref={(viewPager) => {
              this.pagerRef = viewPager;
            }}
            keyboardDismissMode={"on-drag"}
            transitionStyle={"scroll"}
            style={{ flex: selectedMedia.length === 1 ? 0.89 : 0.85 }}
            onPageSelected={(e) => {
              this.setState({ page: e.nativeEvent.position });
              this.setState({ selected: e.nativeEvent.position });
            }}
          >
            {selectedMedia.map((media, index) => {
              let type = media.type.split("/")[0];
              return (
                <View key={index} style={{ flex: 1 }}>
                  {type === "image" ? (
                    <FastImage
                      source={{
                        uri: media.source ? media.source : media.uri,
                      }}
                      style={styles.imageAndVideoStyle}
                      resizeMode={"contain"}
                    />
                  ) : type === "video" ? (
                    <Video
                      ref={(videoRef) => (this.playerRef = videoRef)}
                      poster={media.uri}
                      showOnStart={true}
                      disableFullscreen={true}
                      disableVolume={true}
                      disableBack={true}
                      source={{ uri: media.uri }}
                      paused={playVideo}
                      repeat={true}
                      ignoreSilentSwitch={"ignore"}
                      playInBackground={false}
                      resizeMode={"contain"}
                      style={styles.imageAndVideoStyle}
                    />
                  ) : null}
                </View>
              );
            })}
          </PagerView>

          <View style={{ flex: 0.15 }}>
            <View
              style={[
                styles.footerContentContainer,
                { bottom: selectedMedia.length === 1 ? -20 : 0 },
              ]}
            >
              <View style={styles.captionInputContainer}>
                <TouchableOpacity
                  onPress={() => this.handleMediaType("gallery")}
                >
                  <MaterialCommunityIcons
                    name="image-multiple-outline"
                    size={20}
                    color="grey"
                    style={styles.addMoreBtn}
                  />
                </TouchableOpacity>
                {!this.props.statusState && (
                  <TextInput
                    placeholderTextColor={"grey"}
                    placeholder="Write a Caption!"
                    onChangeText={(val) => this.setState({ caption: val })}
                    style={styles.captionInputStyle}
                  />
                )}
              </View>
              <View style={styles.sendBtnContainer}>
                <TouchableOpacity
                  onPress={() => this.sendHandler(this.state.caption)}
                  style={styles.sendBtn}
                >
                  <FontAwesome5 name={"paper-plane"} size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {selectedMedia.length > 1 && (
              <TouchableOpacity
                activeOpacity={1}
                style={styles.footerThumbnailContainer}
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
                      style={[
                        styles.footerThumbnail,
                        {
                          borderColor:
                            this.state.selected === index
                              ? "cyan"
                              : "transparent",
                        },
                      ]}
                    >
                      {type === "image" ? (
                        <FastImage
                          source={{
                            uri: media.source ? media.source : media.uri,
                          }}
                          style={styles.imageAndVideoStyle}
                          resizeMode={"contain"}
                        />
                      ) : type === "video" ? (
                        <SmallVideo
                          ref={(ref) => (this.smallVidRef = ref)}
                          onLoad={(e) => {
                            this.smallVidRef.seek(0.5);
                          }}
                          source={{ uri: media.uri }}
                          poster={media.uri}
                          paused={playVideo}
                          controls={false}
                          ignoreSilentSwitch={"ignore"}
                          playInBackground={false}
                          resizeMode={"contain"}
                          style={styles.imageAndVideoStyle}
                        />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </TouchableOpacity>
            )}
          </View>
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
  mediaUploadModelContainer: {
    position: "absolute",
    top: "43%",
    bottom: "43%",
    right: "10%",
    left: "10%",
    backgroundColor: "#fff",
    zIndex: 1,
    borderRadius: 10,
    padding: 5,
  },

  progressCircleContainer: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    borderRadius: 5,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  sendingText: {
    fontSize: 18,
    lineHeight: 32,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  sendingProgressText: {
    fontSize: 15,
    lineHeight: 32,
  },

  contentContainer: {
    flex: 1,
    backgroundColor: "#000",
  },

  headerContentContainer: {
    zIndex: 1,
    position: "absolute",
    top: 10,
    flex: 0.07,
    flexDirection: "row",
    alignItems: "center",
  },

  crossBtn: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 5,
  },

  trashBtn: {
    justifyContent: "center",
    marginRight: 25,
    alignItems: "flex-end",
  },

  pencilBtn: {
    justifyContent: "center",
    paddingRight: 10,
    alignItems: "flex-end",
  },

  imageAndVideoStyle: { height: "100%", width: "100%" },

  footerContentContainer: {
    flexDirection: "row",
    height: 60,
    marginHorizontal: 5,
  },

  captionInputContainer: {
    flexDirection: "row",
    flex: 0.88,
    alignItems: "center",
    marginVertical: 5.5,
    backgroundColor: "#fff",
    borderRadius: 25,
    width: "100%",
  },

  addMoreBtn: { marginLeft: 12, marginRight: 10 },
  captionInputStyle: { flex: 1, fontSize: 16 },

  sendBtnContainer: {
    flex: 0.1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
  },

  sendBtn: {
    backgroundColor: "#018679",
    borderRadius: 50 / 2,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },

  footerThumbnailContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0,
  },

  footerThumbnail: {
    width: 60,
    height: 60,
    borderWidth: 2,
  },
});
