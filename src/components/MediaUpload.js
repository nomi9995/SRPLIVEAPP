import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Text,
  Platform,
  Alert,
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import { RNCamera } from "react-native-camera";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import FastImage from "react-native-fast-image";
import axios from "axios";
import Toast from "react-native-simple-toast";
import FileViewer from "react-native-file-viewer";
import ImagePicker from "react-native-image-crop-picker";
import { launchCamera } from "react-native-image-picker";
import { Image, Video } from "react-native-compressor";
import { ProcessingManager } from "react-native-video-processing";

//Redux
import { connect } from "react-redux";
import {
  setMediaType,
  setImagePreview,
  setMediaOptionsOpen,
  setMediaUploadState,
  setStatusState,
} from "../store/actions";

//Components
import MediaUploadPreview from "../components/MediaUploadPreview";
import GifsComponent from "./GifsComponent";

import { onDownload } from "../utils/regex";

const { width, height } = Dimensions.get("window");
class MediaUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cameraType: "back",
      selectedMedia: [],
      messageTypeState: 0,
      saveFormData: [],
      progress: {
        percentage: 0,
        loaded: 0,
        total: 0,
      },
      galleryState: false,
      isCompressing: false,
    };
  }

  componentDidMount = () => {
    BackHandler.addEventListener("hardwareBackPress", this.hardwareBack);

    if (this.props.mediaType === "document") {
      this.documentPicker();
    }
    if (this.props.mediaType === "VideoRecoder") {
      this.recordVideo();
    }
    if (this.props.mediaType === "gallery") {
      this.slectedGalleryMedia();
    }
  };

  componentDidUpdate = (previousProps, previousState) => {
    if (this.props?.mediaType != previousProps?.mediaType) {
      this.slectedGalleryMedia();
    }
  };

  cameraChange = () => {
    if (this.state.cameraType === "back") {
      this.setState({ cameraType: "front" });
    } else {
      this.setState({ cameraType: "back" });
    }
  };

  recordVideo = () => {
    let options = {
      title: "Select Image",
      mediaType: "video",
    };

    launchCamera(options, (res) => {
      if (!res.didCancel) {
        let obj = {
          uri: res?.assets[0].uri,
          name: res?.assets[0].fileName,
          type: "video/mp4",
        };
        let formdata = new FormData();
        formdata.append("files[]", obj);
        if (this.props.statusState === true) {
          formdata.append("video_duration", res?.assets[0]?.duration);
          null;
        } else {
          formdata.append("upload_type", "media");
        }
        this.props.onSetImagePreview(true);
        this.setState({
          selectedMedia: [obj],
          messageTypeState: 11,
          saveFormData: formdata,
        });
      }
      if (res.didCancel) {
        if (this.props.statusState) {
          this.props.onSetStatus(false);
          this.props.onSetMediaType(null);
          this.props.onBack();
        } else {
          this.props.onSetImagePreview(false);
          this.props.onSetMediaType(null);
          this.props.onSetMediaOptionsOpen(false);
          this.props.onSetMediaUploadState(false);
        }
      }
    });
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener("hardwareBackPress", this.hardwareBack);
  };

  hardwareBack = () => {
    this.props.onSetMediaType(null);
    return true;
  };

  documentPicker = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
        copyTo: "cachesDirectory",
      });
      if (Platform.OS == "ios") {
        await FileViewer.open(res.uri, {
          onDismiss: () => {
            this.sendFile(res);
          },
        });
      } else {
        Alert.alert(res.name, `Are you sure you want to send ${res.name}`, [
          {
            text: "Cancel",
            onPress: () => {
              this.documentPicker();
            },
            style: "cancel",
          },
          {
            text: "Send",
            onPress: () => {
              this.sendFile(res);
            },
          },
        ]);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        this.props.onSetImagePreview(false);
        this.props.onSetMediaType(null);
      } else {
        throw err;
      }
    }
  };

  sendFile = (file) => {
    let token = this.props.user?.token;
    let url = "https://www.srplivehelp.com/api/send-files-2";

    let formdata = new FormData();
    formdata.append("files[]", {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });
    formdata.append("upload_type", "file");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        let { progress } = this.state;
        progress = (progressEvent.loaded / progressEvent.total) * 100;
        this.setState({ progress });
      },
    };

    axios
      .post(url, formdata, config)
      .then((resFile) => {
        if (resFile.data.data.files.length > 0) {
          onDownload.copyFile([file], resFile.data.data.files, 6);

          let obj = {
            content: resFile.data.data.files,
            caption: "",
          };
          this.props.onSetImagePreview(false);
          this.props.onSetMediaType(null);
          this.props.onSetMediaOptionsOpen(false);
          this.props.onSetMediaUploadState(false);
          this.props.socketCallBack(JSON.stringify(obj), 6);
        }
      })
      .catch((err) => {
        console.log("FileSendError", err);
        Toast.show("Unable to send file", Toast.SHORT);
        this.props.onSetImagePreview(false);
        this.props.onSetMediaType(null);
        this.props.onSetMediaOptionsOpen(false);
        this.props.onSetMediaUploadState(false);
      });
  };

  captureMedia = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        pauseAfterCapture: true,
        zoom: 1.0,
        fixOrientation: true,
      };
      const data = await this.camera.takePictureAsync(options);
      let URl = data.uri.substring(50);
      let getType = URl.split(".");
      let obj = {
        name: URl,
        uri: data.uri,
        type: `image/${getType[1]}`,
      };
      let formdata = new FormData();
      formdata.append("files[]", obj);
      this.props.onSetImagePreview(true);
      this.setState({
        selectedMedia: [obj],
        messageTypeState: 2,
        saveFormData: formdata,
      });
    }
  };

  slectedGalleryMedia = () => {
    ImagePicker.openPicker({
      multiple: true,
      cropping: false,
    })
      .then((data) => {
        let formdata = new FormData();
        let selectMessageArray = [];
        let check = null;
        data.forEach((element) => {
          formdata.append("files[]", {
            uri: element.path,
            name:
              Platform.OS === "ios"
                ? element.filename
                : element.path.split("/")[element.path.split("/").length - 1],
            type: element.mime,
          });
          if (this.props.statusState === true) {
            formdata.append("video_duration", element?.duration);
          } else {
            formdata.append("upload_type", "media");
          }

          selectMessageArray.push({
            uri: element.path,
            source: Platform.OS === "ios" ? element.sourceURL : element.path,
            name:
              Platform.OS === "ios"
                ? element.filename
                : element.path.split("/")[element.path.split("/").length - 1],
            type: element.mime,
          });
          check = element?.duration;
        });
        this.props.onSetImagePreview(true);
        let found = false;

        this.state.selectedMedia.filter((item) => {
          for (var i = 0; i < selectMessageArray.length; i++) {
            if (selectMessageArray[i].source === item.source) {
              found = true;
              break;
            }
          }
        });
        if (!found) {
          this.setState({
            selectedMedia: this.state.selectedMedia.concat(selectMessageArray),
            messageTypeState: check ? 11 : 2,
            saveFormData: formdata,
          });
        }
      })
      .catch((e) => {
        if (this.props.statusState) {
          this.props.onSetStatus(false);
          this.props.onSetMediaType(null);
          this.props.onBack();
        } else {
          this.props.onSetImagePreview(false);
          this.props.onSetMediaType(null);
          this.props.onSetMediaOptionsOpen(false);
          this.props.onSetMediaUploadState(false);
        }
      });
  };

  slectedGifMedia = (res) => {
    this.props.socketCallBack(res, 3);
    this.props.onSetImagePreview(false);
    this.props.onSetMediaType(null);
    this.props.onSetMediaOptionsOpen(false);
    this.props.onSetMediaUploadState(false);
  };

  compressMedia = async (media, caption = "") => {
    this.setState({ isCompressing: true });
    let compressedMedia = [];
    let type = "";
    let path = "";
    let imgQual = 0.7;
    let maxWidth = 800;
    let imgOptions = {};

    if (this.props.compressionQuality == "low") {
      imgQual = 0.9;
      maxWidth = 1000;
    } else if (this.props.compressionQuality == "medium") {
      imgQual = 0.7;
      maxWidth = 800;
    } else if (this.props.compressionQuality == "high") {
      imgQual = 0.5;
      maxWidth = 500;
    }

    for (let index = 0; index < media.length; index++) {
      const element = media[index];
      path = element.source ? element.source : element.uri;
      type = element.type.split("/")[0];

      if (type == "image") {
        let result;
        if (this.props.compressionQuality == "auto") {
          imgOptions = {
            compressionMethod: "auto",
          };
        } else {
          imgOptions = {
            maxWidth: maxWidth,
            quality: imgQual,
          };
        }

        if (this.props.compressionQuality == "uncompressed") {
          result = path;
        } else {
          result = await Image.compress(path, imgOptions);
        }

        let obj = {
          uri: result,
          name: element.name,
          type: element.type,
        };
        compressedMedia.push(obj);
      } else if (type == "video") {
        let data;
        let obj = {};
        if (this.props.videoCompressionQuality == "uncompressed") {
          data = path;
          obj = {
            uri: data,
            name: element.name,
            type: element.type,
          };
        } else {
          let vidOptions = {
            compressionMethod: "auto",
          };
          data = await Video.compress(path, vidOptions);
          obj = {
            uri: data,
            name: element.name,
            type: element.type,
          };
        }
        compressedMedia.push(obj);
      }
    }
    this.setState({ isCompressing: false });
    this.uploadMedia(compressedMedia, caption);
    // }
  };

  uploadMedia = async (imgs, caption = "") => {
    let token = this.props.user?.token;
    let url = "https://www.srplivehelp.com/api/send-files-2";

    let formdata = new FormData();
    imgs?.forEach((element, index) => {
      formdata.append("files[]", {
        uri: element.uri,
        name: element.name,
        type: element.type,
      });
    });
    formdata.append("upload_type", "media");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        let { progress } = this.state;
        progress = {
          percentage: (progressEvent.loaded / progressEvent.total) * 100,
          loaded: progressEvent.loaded / 1024 / 1024,
          total: progressEvent.total / 1024 / 1024,
        };
        this.setState({ progress });
      },
    };

    axios
      .post(url, formdata, config)
      .then(async (media) => {
        if (media.data.data.images.length > 0) {
          onDownload.copyFile(imgs, media.data.data.images, 2);

          let obj = {
            content: media.data.data.images,
            caption: caption,
          };
          this.props.socketCallBack(JSON.stringify(obj), 2);
        }

        if (media.data.data.videos.length > 0) {
          onDownload.copyFile(imgs, media.data.data.videos, 11);

          let obj = {
            content: media.data.data.videos,
            caption: caption,
          };
          this.props.socketCallBack(JSON.stringify(obj), 11);
        }

        this.props.onSetImagePreview(false);
        this.props.onSetMediaType(null);
        this.props.onSetMediaOptionsOpen(false);
        this.props.onSetMediaUploadState(false);
      })
      .catch((err) => {
        console.log("mediaSendError", err);
        Toast.show("Unable to send media", Toast.SHORT);
        this.props.onSetImagePreview(false);
        this.props.onSetMediaType(null);
        this.props.onSetMediaOptionsOpen(false);
        this.props.onSetMediaUploadState(false);
      });
  };

  deleteMedia = (indx) => {
    let dummyArray = [...this.state.selectedMedia];
    this.setState({
      selectedMedia: dummyArray.filter((item, index) => index != indx),
    });
  };

  cameraBackButton = () => {
    if (this.props.statusState) {
      this.props.onSetMediaType(null);
      this.props.onSetStatus(false);
      this.props.onBack();
    } else {
      this.props.onSetMediaType(null);
    }
  };

  uploadStatus = () => {
    let token = this.props.user?.token;

    fetch("https://www.srplivehelp.com/api/story-add", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      body: this.state.saveFormData,
    })
      .then(async (res) => {
        return res.json();
      })
      .then((video) => {
        this.props.onSetStatus(false);
        this.props.onBack();
        this.props.onSetMediaUploadState(false);
        this.props.onSetImagePreview(false);
        this.props.onSetMediaType(null);
      })
      .catch((err) => {
        Toast.show("Media upload failed!");
        this.props.onSetStatus(false);
        this.props.onBack();
        this.props.onSetMediaUploadState(false);
        this.props.onSetImagePreview(false);
        this.props.onSetMediaType(null);
        console.log("++ ", JSON.stringify(err));
      });
  };

  galleryCallback = (val) => {
    this.props.onSetMediaType(val);
    if (this.props.mediaType === "gallery") {
      this.slectedGalleryMedia();
    }
  };

  renderContent() {
    return (
      <View style={styles.controlLayer}>
        <TouchableOpacity
          style={styles.syncAltButton}
          onPress={() => this.cameraChange()}
        >
          <FontAwesome name={"sync"} style={styles.syncAltIcon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => this.cameraBackButton()}
        >
          <FontAwesome name={"arrow-left"} style={styles.syncAltIcon} />
        </TouchableOpacity>
        <View style={styles.controls}>
          <View style={styles.getGalleryDataView}>
            <TouchableOpacity
              style={styles.getGalleryDataButton}
              onPress={() => this.props.onSetMediaType("gallery")}
            >
              <FastImage
                source={require("../assets/gallery.png")}
                style={styles.getGalleryDataImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.captureMedia()}
            >
              <View style={styles.circleInside}></View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.recordVideo();
                this.props.onSetMediaOptionsOpen(false);
              }}
            >
              <FastImage
                source={require("../assets/video.png")}
                style={styles.videoImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <>
        {this.props.mediaType === "camera" && !this.props.imagePreview && (
          <RNCamera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            captureAudio
            autoFocus={"on"}
            type={this.state.cameraType}
          >
            {this.renderContent()}
          </RNCamera>
        )}
        {this.props.mediaType === "gif" && !this.props.imagePreview && (
          <View style={{ backgroundColor: "transparent", height: "100%" }}>
            <GifsComponent
              selectedMedia={(data) => {
                this.slectedGifMedia(data);
              }}
            />
          </View>
        )}

        {this.state.selectedMedia.length > 0 && (
          <MediaUploadPreview
            isCompressing={this.state.isCompressing}
            galleryCallback={this.galleryCallback}
            progressData={this.state.progress}
            selectedMedia={this.state.selectedMedia}
            previewVisible={this.props.imagePreview}
            messageTypeState={this.state.messageTypeState}
            deleteMedia={this.deleteMedia}
            onUploadMedia={(imgs, caption) => {
              if (!this.props.statusState) {
                this.compressMedia(imgs, caption);
              } else {
                this.uploadStatus();
              }
            }}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mediaType: state.stateHandler.mediaType,
    imagePreview: state.stateHandler.imagePreview,
    user: state.auth.user,
    statusState: state.stateHandler.statusState,
    compressionQuality: state.autoDownload.compressionQuality,
    audioCompressionQuality: state.autoDownload.audioCompressionQuality,
    videoCompressionQuality: state.autoDownload.videoCompressionQuality,
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
    onSetMediaOptionsOpen: (data) => {
      dispatch(setMediaOptionsOpen(data));
    },
    onSetMediaUploadState: (data) => {
      dispatch(setMediaUploadState(data));
    },
    onSetStatus: (data) => {
      dispatch(setStatusState(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaUpload);

const styles = StyleSheet.create({
  preview: {
    width,
    height,
  },
  controlLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 40,
    right: 0,
    backgroundColor: "transparent",
  },
  controls: {
    position: "absolute",
    bottom: 0,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    width,
  },
  buttonContainer: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "#D91E18",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  circleInside: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#D91E18",
  },
  syncAltButton: {
    position: "absolute",
    top: 35,
    right: 15,
    padding: 10,
  },
  backButton: {
    position: "absolute",
    top: 35,
    left: 15,
    padding: 10,
  },
  syncAltIcon: {
    fontSize: 20,
    color: "white",
  },
  getGalleryDataView: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  getGalleryDataButton: {
    padding: 5,
    marginLeft: 10,
  },
  getGalleryDataImage: {
    width: 50,
    height: 50,
  },
  videoImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  galleryComponentView: {
    backgroundColor: "transparent",
    height: "100%",
  },
});
