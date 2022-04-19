import React from "react";
import {
  Text,
  View,
  Linking,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";

import moment from "moment-timezone";
import Video from "react-native-video";
import RNFetchBlob from "rn-fetch-blob";
import Slider from "react-native-slider";
import FastImage from "react-native-fast-image";
import FileViewer from "react-native-file-viewer";
import LocalTimeZone from "react-native-localize";
import Color from "react-native-gifted-chat/lib/Color";
import HighlightText from "@sanar/react-native-highlight-text";

// Icons
import Octicons from "react-native-vector-icons/dist/Octicons";
import Icon from "react-native-vector-icons/dist/MaterialIcons";
import AntDesign from "react-native-vector-icons/dist/AntDesign";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome";
import MaterialIcons from "react-native-vector-icons/dist/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/dist/SimpleLineIcons";

//Redux
import { connect } from "react-redux";
import {
  setOnLongPress,
  setReplyNavigate,
  setAudioPlayState,
} from "../store/actions";

// Components
import PdfThumail from "./pdfThumnail";
import FileTypeIcon from "../components/FileTypeIcon";
import ImageThumbnail from "../components/ImageThumbnail";
import CalculatedImageViewer from "./heightCalculatedImage";
import CalculatedTextViewer from "./HightWidthCalulatedText";

// Utils
import { onDownload } from "../utils/regex";
import appConfig from "../utils/appConfig";

// Constants
const { fs } = RNFetchBlob;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class MessageBubble extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPositionSec: 0,
      currentDurationSec: 0,
      audio_played: false,
      pause_audio_played: false,
      audioDuration: 50,
      videosArray: [],
      audiosArray: [],
      filesArray: [],
      isDownloading: false,
      audio_playTime: "00:00",
    };
    this.setMessagesInState();
  }

  setMessagesAudio = (showAudio) => {
    let temp = [];
    onDownload.checkExistingMedia(showAudio.name, "Audios").then((res) => {
      showAudio.name =
        res && this.props.position === "left"
          ? Platform.OS === "ios"
            ? `${fs.dirs.DocumentDir}/srp_live/Audios/${showAudio.name}`
            : appConfig.localPath + "Audios/" + showAudio.name
          : showAudio.name;
      showAudio.isDownloaded = res;
      temp.push(showAudio);
      this.setState({ audiosArray: temp });
    });
  };

  setMessagesVideo = (showVideo) => {
    let temp = [];
    if (this.props.position === "left") {
      showVideo.forEach((video) => {
        console.log("video: ", video);
        onDownload
          .checkExistingMedia(video.name, "Videos")
          .then(async (res) => {
            console.log("res: ", res);
            video.name = res
              ? Platform.OS === "ios"
                ? `${fs.dirs.DocumentDir}/srp_live/Videos/${video.name}`
                : appConfig.localPath + "Videos/" + video.name
              : video.name;
            video.isDownloaded = res;
            temp.push(video);
            this.setState({ videosArray: temp });
          });
      });
    } else {
      showVideo.forEach((video) => {
        onDownload
          .checkExistingMediaSend(video.name, "Videos")
          .then(async (res) => {
            if (res) {
              video.name = res
                ? Platform.OS === "ios"
                  ? `${fs.dirs.DocumentDir}/srp_live/Videos/Sent/${video.name}`
                  : appConfig.localPath + "Videos/Sent/" + video.name
                : video.name;
              video.isDownloaded = res;
              temp.push(video);
              this.setState({ videosArray: temp });
            } else {
              video.name = appConfig.videoImagePath + video?.name;
              temp.push(video);
              this.setState({ videosArray: temp });
            }
          });
      });
    }
  };

  setMessagesFile = (showFile) => {
    let temp = [];
    showFile.forEach((file) => {
      onDownload.checkExistingMedia(file.name, "Files").then((res) => {
        file.name =
          res && this.props.position === "left"
            ? Platform.OS === "ios"
              ? `${fs.dirs.DocumentDir}/srp_live/Files/${file.name}`
              : appConfig.localPath + "Files/" + file.name
            : file.name;
        file.isDownloaded = res;
        temp.push(file);
        this.setState({ filesArray: temp });
      });
    });
  };

  setMessagesInState = () => {
    if (this.props?.currentMessage?.type === 11) {
      if (JSON.parse(this.props.currentMessage.message).content) {
        let showVideo = [];
        let videos = JSON.parse(this.props.currentMessage.message).content;
        videos.forEach((video) => {
          showVideo.push(
            Object.assign(
              video,
              { isDownloaded: false },
              { isDownloading: false }
            )
          );
        });
        this.setMessagesVideo(showVideo);
      } else {
        this.setState({ videosArray: null });
      }
    } else if (this.props?.currentMessage?.type === 6) {
      if (JSON.parse(this.props?.currentMessage?.message)?.content) {
        let files = JSON.parse(this.props?.currentMessage.message).content;
        let showFile = [];
        files.forEach((file) => {
          showFile.push(
            Object.assign(
              file,
              { isDownloaded: false },
              { isDownloading: false }
            )
          );
        });
        this.setMessagesFile(showFile);
      } else {
        this.setState({ filesArray: null });
      }
    } else if (this.props?.currentMessage?.type === 7) {
      let showAudio = Object.assign(
        JSON.parse(this.props.currentMessage.message),
        { isDownloaded: false }
      );
      this.setMessagesAudio(showAudio);
    } else if (this.props?.currentMessage?.type === 8) {
      let replyMsg = JSON.parse(this.props.currentMessage.message);
      if (replyMsg.reply_message.reply_type == 8) {
        return null;
      }
      if (replyMsg?.new_message?.new_type === 6) {
        let replyFileMsg = [];
        let files = JSON.parse(replyMsg?.new_message?.new_content).content;
        files.forEach((file) => {
          replyFileMsg.push(
            Object.assign(
              file,
              { isDownloaded: false },
              { isDownloading: false }
            )
          );
        });
        this.setMessagesFile(replyFileMsg);
      }
      if (replyMsg?.new_message?.new_type === 7) {
        let replyAudioMsg = Object.assign(
          JSON.parse(replyMsg?.new_message?.new_content),
          { isDownloaded: false }
        );
        this.setMessagesAudio(replyAudioMsg);
      }
      if (replyMsg?.new_message?.new_type === 11) {
        let replyVideoMsg = [];
        let videos = JSON.parse(replyMsg?.new_message?.new_content).content;
        videos.forEach((video) => {
          replyVideoMsg.push(
            Object.assign(
              video,
              { isDownloaded: false },
              { isDownloading: false }
            )
          );
        });
        this.setMessagesVideo(replyVideoMsg);
      }
    } else if (this.props?.currentMessage?.type === 9) {
      let forwardedMsg = JSON.parse(this.props.currentMessage.message);
      if (forwardedMsg.type === 6) {
        let forwardedFile = [];
        let files = JSON.parse(forwardedMsg.message).content;
        files.forEach((file) => {
          forwardedFile.push(
            Object.assign(
              file,
              { isDownloaded: false },
              { isDownloading: false }
            )
          );
        });
        this.setMessagesFile(forwardedFile);
      } else if (forwardedMsg.type === 7) {
        let forwardedAudio = Object.assign(JSON.parse(forwardedMsg.message), {
          isDownloaded: false,
        });
        this.setMessagesAudio(forwardedAudio);
      } else if (forwardedMsg.type === 11) {
        let forwardedVideo = [];
        let videos = JSON.parse(forwardedMsg.message).content;
        videos.forEach((video) => {
          forwardedVideo.push(
            Object.assign(
              video,
              { isDownloaded: false },
              { isDownloading: false }
            )
          );
        });
        this.setMessagesVideo(forwardedVideo);
      }
    }
  };

  downloadMedia = (type, ind = 0) => {
    if (type === "Videos") {
      let vidArray = this.state?.videosArray;
      vidArray[ind].isDownloading = true;
      this.setState({ videosArray: vidArray });
      if (Platform.OS == "android") {
        onDownload.downloadFile(vidArray[ind].name, "Videos", (res) => {
          if (res) {
            vidArray[ind].name = res.data;
            vidArray[ind].isDownloaded = true;
            vidArray[ind].isDownloading = false;
            this.setState({ videosArray: vidArray });
          }
        });
      } else {
        onDownload.downloadFileIos(vidArray[ind].name, "Videos", (res) => {
          if (res) {
            vidArray[ind].name = res.data;
            vidArray[ind].isDownloaded = true;
            vidArray[ind].isDownloading = false;
            this.setState({ videosArray: vidArray, isDownloading: false });
          }
        });
      }
    } else if (type === "Files") {
      let arr = this.state?.filesArray;
      arr[ind].isDownloading = true;
      this.setState({ filesArray: arr });
      if (Platform.OS == "android") {
        onDownload.downloadFile(arr[ind].name, "Files", (res) => {
          if (res) {
            arr[ind].name = res.data;
            arr[ind].isDownloaded = true;
            arr[ind].isDownloading = false;
            this.setState({ filesArray: arr });
          }
        });
      } else {
        onDownload.downloadFileIos(arr[ind]?.name, "Files", (res) => {
          if (res) {
            arr[ind].name = res.data;
            arr[ind].isDownloaded = true;
            arr[ind].isDownloading = false;
            this.setState({ filesArray: arr, isDownloading: false });
          }
        });
      }
    } else if (type === "Audios") {
      this.setState({ isDownloading: true });
      let audArray = this.state?.audiosArray;
      if (Platform.OS == "android") {
        onDownload.downloadFile(audArray[ind].name, "Audios", (res) => {
          if (res) {
            audArray[ind].name = res.data;
            audArray[ind].isDownloaded = true;
            audArray[ind].isDownloading = false;
            this.setState({ audiosArray: audArray, isDownloading: false });
          }
        });
      } else {
        onDownload.downloadFileIos(audArray[ind].name, "Audios", (res) => {
          if (res) {
            audArray[ind].name = res.data;
            audArray[ind].isDownloaded = true;
            audArray[ind].isDownloading = false;
            this.setState({ audiosArray: audArray, isDownloading: false });
          }
        });
      }
    }
  };

  longPressAction = () => {
    this.props.onSetOnLongPress([this.props?.currentMessage]);
  };

  renderMessageText() {
    if (this.props?.currentMessage?.type === 1) {
      return (
        <View style={styles.messageTextFlex}>
          {this.props.keywords ? (
            <HighlightText
              highlightStyle={{
                backgroundColor: "yellow",
                fontWeight: "bold",
              }}
              style={styles.messageText}
              searchWords={this.props.keywords}
              textToHighlight={this.props.currentMessage.message}
            />
          ) : (
            <CalculatedTextViewer
              message={this.props.currentMessage.message}
              style={styles.messageText}
            />
          )}
        </View>
      );
    } else if (this.props?.currentMessage?.type === 9) {
      let showForward = JSON.parse(this.props.currentMessage.message);
      if (showForward.type === 1) {
        return (
          <View style={styles.messageTextFlex}>
            <CalculatedTextViewer
              message={showForward.message}
              style={styles.messageText}
            />
          </View>
        );
      }
    } else if (this.props?.currentMessage?.type === 8) {
      let replyMsg = JSON.parse(this.props.currentMessage.message);
      if (replyMsg?.reply_message?.reply_type === 1) {
        return (
          <>
            {this.props.position === undefined ? (
              <View style={styles.messageSelectedReplyDesign}>
                <Text style={styles.replyFormUsername}>
                  {replyMsg?.reply_message?.reply_from}
                </Text>
                <Text style={styles.replyFormUsername}>
                  {replyMsg?.reply_message?.reply_from}
                </Text>
                <Text style={{ marginLeft: 5, fontFamily: "Roboto-Regular" }}>
                  {replyMsg?.reply_message?.reply_content}
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles[this.props.position].messageSelectedReplyDesign,
                  { maxWidth: windowWidth * 0.74 },
                ]}
              >
                <Text style={styles[this.props.position].replyFormUsername}>
                  {replyMsg?.reply_message?.reply_from}
                </Text>
                <Text style={{ marginLeft: 5, fontFamily: "Roboto-Regular" }}>
                  {replyMsg?.reply_message?.reply_content}
                </Text>
              </View>
            )}
          </>
        );
      } else if (replyMsg?.reply_message?.reply_type === 8) {
        return (
          <View style={styles[this.props.position].messageSelectedReplyDesign}>
            <Text style={styles[this.props.position].replyFormUsername}>
              {replyMsg?.reply_message?.reply_from}
            </Text>
            <Text style={{ marginLeft: 5, fontFamily: "Roboto-Regular" }}>
              {
                JSON.parse(replyMsg?.reply_message?.reply_content).new_message
                  .new_content
              }
            </Text>
          </View>
        );
      }
    }
    return null;
  }

  openImages = (images) => {
    if (this.props.longPress.length !== 0) {
      this.props.onSetOnLongPress([
        this.props.currentMessage,
        ...this.props.longPress,
      ]);
    } else {
      let imgArray = [];
      images.map((img) => {
        if (Platform.OS == "android") {
          if (this.props.position === "left") {
            imgArray.push(
              "file://" + appConfig.localPath + "Images/" + img.uri
            );
          } else {
            imgArray.push(appConfig.imageLargePath + img.uri);
          }
        } else {
          if (this.props.position === "left") {
            imgArray.push(fs.dirs.DocumentDir + "/srp_live/Images/" + img.uri);
          } else {
            imgArray.push(appConfig.imageLargePath + img.uri);
          }
        }
      });

      this.props.navProps.navigate("MessagePreview", {
        sliderState: imgArray,
      });
    }
  };

  renderMessageImage() {
    if (this.props?.currentMessage?.type === 2) {
      let images = [];
      let showImage = JSON.parse(this.props?.currentMessage?.message)?.content;
      if (showImage) {
        showImage?.forEach((element) => {
          images.push({ uri: element });
        });

        return (
          <TouchableOpacity
            onPress={() => this.openImages(images)}
            onLongPress={this.longPressAction}
          >
            <ImageThumbnail
              images={images}
              msgType={2}
              msgPosition={this.props.position}
            />
          </TouchableOpacity>
        );
      } else {
        return (
          <View style={styles.messageFileView}>
            <Text style={{ fontWeight: "bold", color: "#000" }}>
              # ENCODING ERROR
            </Text>
          </View>
        );
      }
    } else if (this.props?.currentMessage?.type === 9) {
      let showForward = JSON.parse(this.props.currentMessage.message);
      if (showForward.type === 2) {
        let showForwardMsg = JSON.parse(showForward.message).content;
        let images = [];
        showForwardMsg.forEach((element) => {
          images.push({ uri: element });
        });
        return (
          <TouchableOpacity
            onPress={() => this.openImages(images)}
            onLongPress={this.longPressAction}
          >
            <ImageThumbnail
              images={images}
              msgType={9}
              msgPosition={this.props.position}
            />
          </TouchableOpacity>
        );
      }
    } else if (this.props?.currentMessage?.type === 8) {
      let showReply = JSON.parse(this.props.currentMessage.message);
      if (showReply?.reply_message?.reply_type === 2) {
        let showReplyImage = JSON.parse(
          showReply?.reply_message?.reply_content
        ).content;
        let images = [];
        showReplyImage.forEach((element) => {
          images.push({ uri: element });
        });
        return (
          <View>
            <View style={styles[this.props.position].replyImageLinkStickerView}>
              <View style={styles[this.props.position].replyImageStickerInner}>
                <Text
                  style={styles[this.props.position].replyImageLinkStickerName}
                >
                  You
                </Text>
                <View
                  style={
                    styles[this.props.position].replyImageLinkStickerIconView
                  }
                >
                  <FontAwesome
                    name={"image"}
                    style={
                      styles[this.props.position].replyImageStickerLinkIcon
                    }
                  />
                  <Text style={{ fontFamily: "Roboto-Regular" }}>Photo</Text>
                </View>
              </View>
              <ImageThumbnail
                images={images}
                size={50}
                msgType={8}
                msgPosition={this.props.position}
              />
            </View>
          </View>
        );
      }
    }
    return null;
  }

  renderMessageGif() {
    if (this.props.currentMessage.type === 3) {
      return (
        <View style={styles.imageMessageFlex}>
          <FastImage
            source={{ uri: this.props.currentMessage.message }}
            style={{ height: "100%", width: "100%", borderRadius: 10 }}
          />
        </View>
      );
    } else if (this.props?.currentMessage?.type === 8) {
      let showReply = JSON.parse(
        this.props.currentMessage.message
      ).reply_message;
      if (showReply?.reply_type === 3) {
        return (
          <View>
            <View style={styles[this.props.position].replyImageLinkStickerView}>
              <View style={styles[this.props.position].replyImageStickerInner}>
                <Text
                  style={styles[this.props.position].replyImageLinkStickerName}
                >
                  {showReply.reply_from}
                </Text>
                <View
                  style={
                    styles[this.props.position].replyImageLinkStickerIconView
                  }
                >
                  <FontAwesome
                    name={"image"}
                    style={
                      styles[this.props.position].replyImageStickerLinkIcon
                    }
                  />
                  <Text style={{ fontFamily: "Roboto-Regular" }}>GIF</Text>
                </View>
              </View>
              <FastImage
                source={{ uri: showReply.reply_content }}
                style={{ height: 45, width: 45, borderRadius: 10 }}
              />
            </View>
          </View>
        );
      }
    } else if (this.props?.currentMessage?.type === 9) {
      let showForward = JSON.parse(this.props.currentMessage.message);
      if (showForward.type === 3) {
        return (
          <View style={styles.imageMessageFlex}>
            <FastImage
              source={{ uri: showForward.message }}
              style={{ height: "100%", width: "100%", borderRadius: 10 }}
            />
          </View>
        );
      }
    }
    return null;
  }

  renderMessageSticker() {
    if (this.props.currentMessage.type === 4) {
      let showSticker = this.props?.currentMessage.message;
      return (
        <View style={{ paddingBottom: 7 }}>
          <FastImage
            source={{ uri: appConfig.stickers + showSticker }}
            style={styles[this.props?.position]?.messageSticker}
          />
        </View>
      );
    } else if (this.props.currentMessage.type === 9) {
      let showSticker = JSON.parse(this.props.currentMessage.message);
      if (showSticker.type === 4) {
        return (
          <View>
            <FastImage
              source={{ uri: appConfig.stickers + showSticker.message }}
              style={styles[this.props?.position]?.messageSticker}
            />
          </View>
        );
      }
    } else if (this.props.currentMessage.type === 8) {
      let showReply = JSON.parse(this.props.currentMessage.message);
      if (showReply?.reply_message?.reply_type === 4) {
        return (
          <View style={styles[this.props.position].replyImageLinkStickerView}>
            <View style={styles[this.props.position].replyImageStickerInner}>
              <Text
                style={styles[this.props.position].replyImageLinkStickerName}
              >
                You
              </Text>
              <View
                style={
                  styles[this.props.position].replyImageLinkStickerIconView
                }
              >
                <FontAwesome
                  name={"smile-beam"}
                  style={styles[this.props.position].replyImageStickerLinkIcon}
                />
                <Text style={{ fontFamily: "Roboto-Regular" }}>Sticker</Text>
              </View>
            </View>
            <FastImage
              source={{
                uri:
                  appConfig.stickers + showReply?.reply_message?.reply_content,
              }}
              style={styles[this.props.position].replyStickerLinkImage}
            />
          </View>
        );
      }
    }
    return null;
  }

  renderMessageLink() {
    if (this.props.currentMessage.type === 5) {
      let showLink = JSON.parse(this.props.currentMessage.message);
      return (
        <TouchableOpacity
          style={styles.messageLinkFlex}
          onPress={() => Linking.openURL(showLink.url)}
        >
          <Text
            numberOfLines={1}
            style={{ color: "green", fontFamily: "Roboto-Light" }}
          >
            {showLink.url}
          </Text>
          <Text numberOfLines={3} style={{ fontFamily: "Roboto-Light" }}>
            {showLink.title}
          </Text>
        </TouchableOpacity>
      );
    } else if (this.props.currentMessage.type === 9) {
      let showLink = JSON.parse(this.props.currentMessage.message);
      if (showLink.type === 5) {
        let showLinkForwardMsg = JSON.parse(showLink.message);
        return (
          <TouchableOpacity
            style={styles.messageLinkFlex}
            onPress={() => Linking.openURL(showLinkForwardMsg.url)}
          >
            <Text
              numberOfLines={1}
              style={{ color: "green", fontFamily: "Roboto-Light" }}
            >
              {showLinkForwardMsg.url}
            </Text>
            <Text numberOfLines={3} style={{ fontFamily: "Roboto-Light" }}>
              {showLinkForwardMsg.title}
            </Text>
          </TouchableOpacity>
        );
      }
    } else if (this.props.currentMessage.type === 8) {
      let showReply = JSON.parse(this.props.currentMessage.message);
      if (showReply?.reply_message?.reply_type === 5) {
        let showReplyLink = JSON.parse(showReply?.reply_message?.reply_content);
        return (
          <View style={styles[this.props.position].replyImageLinkStickerView}>
            <View style={{ marginLeft: 5 }}>
              <Text
                style={styles[this.props.position].replyImageLinkStickerName}
              >
                Link
              </Text>
              <View
                style={
                  styles[this.props.position].replyImageLinkStickerIconView
                }
              >
                <FontAwesome
                  name={"link"}
                  style={styles[this.props.position].replyImageStickerLinkIcon}
                />
                <Text
                  numberOfLines={1}
                  style={{ color: "green", width: "70%" }}
                >
                  {showReplyLink.url}
                </Text>
              </View>
            </View>
            <FastImage
              source={
                showReplyLink.image === null
                  ? require("../assets/deafultimage.png")
                  : { uri: showReplyLink.image }
              }
              style={styles[this.props.position].replyStickerLinkImage}
            />
          </View>
        );
      }
    }
    return null;
  }

  openFile = async (data) => {
    if (this.props.longPress.length !== 0) {
      this.props.onSetOnLongPress([
        this.props.currentMessage,
        ...this.props.longPress,
      ]);
    } else {
      if (data.isDownloaded && this.props.position === "left") {
        let url = data.name;
        try {
          await FileViewer.open(url, {
            showOpenWithDialog: true,
            showAppsSuggestions: true,
          });
        } catch (e) {
          console.log("An error occurred", e);
        }
      } else {
        let url = appConfig.filePath + data.name;
        Linking.openURL(url);
      }
    }
  };

  renderMessageFile() {
    if (this.props?.currentMessage?.type === 6) {
      let showFile = JSON.parse(this.props?.currentMessage.message).content;
      return this.state?.filesArray ? (
        this.state?.filesArray?.map((res, ind) => {
          return (
            <TouchableOpacity
              key={ind}
              style={styles.messageFileView}
              onPress={() => this.openFile(res)}
              onLongPress={this.longPressAction}
            >
              {showFile[ind].name.includes(".pdf") ? (
                <>
                  <PdfThumail data={res} />
                </>
              ) : null}
              <View style={styles.messageFileFlex}>
                <FileTypeIcon
                  data={res}
                  style={{
                    color: "red",
                    fontSize: 25,
                  }}
                />
                <Text
                  numberOfLines={1}
                  style={styles[this.props?.position]?.fileNameText}
                >
                  {showFile[ind].name}
                </Text>
                {res.isDownloading ? (
                  <View style={{ padding: 5 }}>
                    <ActivityIndicator size={"small"} color={"#fff"} />
                  </View>
                ) : !res.isDownloaded && this.props.position === "left" ? (
                  <TouchableOpacity
                    style={{
                      padding: 5,
                    }}
                    onPress={() => this.downloadMedia("Files", ind)}
                  >
                    <FontAwesome5
                      name={"arrow-circle-o-down"}
                      size={23}
                      color={"grey"}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <Text style={styles[this.props?.position]?.fileSizeText}>
                {res.size}
              </Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.messageFileView}>
          <Text style={{ fontWeight: "bold", color: "#000" }}>
            # FILE DECODE ERROR
          </Text>
        </View>
      );
    } else if (this.props?.currentMessage?.type === 9) {
      let showFile = JSON.parse(this.props?.currentMessage.message);
      if (showFile.type === 6) {
        let showFileForwardMsg = JSON.parse(showFile.message).content;
        return this.state?.filesArray ? (
          this.state?.filesArray.map((res, ind) => {
            return (
              <TouchableOpacity
                key={ind}
                style={styles.messageFileView}
                onPress={() => this.openFile(res)}
                onLongPress={this.longPressAction}
              >
                <View style={styles.messageFileFlex}>
                  <FileTypeIcon
                    data={res}
                    style={{
                      color: "red",
                      fontSize: 25,
                    }}
                  />
                  <Text
                    numberOfLines={1}
                    style={styles[this.props?.position]?.fileNameText}
                  >
                    {showFileForwardMsg[ind]?.name}
                  </Text>
                  {res.isDownloading ? (
                    <View style={{ padding: 5 }}>
                      <ActivityIndicator size={"small"} color={"#fff"} />
                    </View>
                  ) : !res?.isDownloaded && this.props.position === "left" ? (
                    <TouchableOpacity
                      style={{ padding: 5 }}
                      onPress={() => this.downloadMedia("Files", ind)}
                    >
                      <FontAwesome5
                        name={"arrow-circle-o-down"}
                        size={23}
                        color={"grey"}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <Text style={styles[this.props?.position]?.fileSizeText}>
                  {res?.size}
                </Text>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.messageFileView}>
            <Text style={{ fontWeight: "bold", color: "#000" }}>
              # FILE DECODE ERROR
            </Text>
          </View>
        );
      }
    } else if (this.props?.currentMessage?.type === 8) {
      let showReply = JSON.parse(this.props.currentMessage.message);
      if (showReply?.reply_message?.reply_type === 6) {
        let showReplyFile = JSON.parse(
          showReply?.reply_message?.reply_content
        ).content;
        return showReplyFile.map((res, ind) => {
          return (
            <View style={styles[this.props.position].FileView} key={ind}>
              <View style={{ marginLeft: 5 }}>
                <Text style={styles[this.props.position].FileViewText}>
                  Your Chat
                </Text>
                <View style={styles[this.props.position].FileIconView}>
                  <AntDesign
                    name={"pdffile1"}
                    style={styles[this.props.position].FileIcon}
                  />
                  <Text style={styles[this.props?.position]?.fileNameText}>
                    file
                  </Text>
                </View>
              </View>
            </View>
          );
        });
      }
    }
    return null;
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.audioState != this.props.audioState) {
      if (this.props.audioState != this.state?.audiosArray[0]?.name) {
        this.setState({ audio_played: false });
      }
    }
  };

  onProgress = async (ev) => {
    let minutes = Math.floor(ev.currentTime / 60);
    let seconds = Math.floor(ev.currentTime - minutes * 60);
    let time = `${minutes} : ${seconds}`;
    await this.setState({
      currentDurationSec: ev.playableDuration,
      currentPositionSec: ev.currentTime,
      audio_playTime: time,
    });
  };

  onEnd = async () => {
    await this.setState({
      currentDurationSec: 0,
      currentPositionSec: 0,
      audio_played: false,
    });
  };

  playPauseAction = async () => {
    await this.setState({
      audio_played: !this.state.audio_played,
    });
    this.props.onSetAudioPlayState(this.state?.audiosArray[0]?.name);
  };

  onSlidingComplete = (ev) => {
    let time = (ev / 100) * this.state.currentDurationSec;
    this.audioPlayerRef.seek(time);
  };

  renderMessageAudio() {
    if (this.props?.currentMessage?.type === 7) {
      let showAudio = JSON.parse(this.props.currentMessage.message);
      let playWidth =
        (this.state.currentPositionSec / this.state.currentDurationSec) * 100;

      let localFile =
        this.props.position === "left"
          ? Platform.OS == "android"
            ? this.state?.audiosArray[0]?.name
            : "file://" + this.state?.audiosArray[0]?.name
          : appConfig.adiouPath + this.state?.audiosArray[0]?.name;

      if (!playWidth) {
        playWidth = 0;
      }

      return (
        <View style={styles.audioMessageView}>
          <Video
            ref={(videoRef) => (this.audioPlayerRef = videoRef)}
            source={{ uri: localFile }}
            style={styles.playerStyle}
            audioOnly={true}
            resizeMode={"contain"}
            controls={false}
            paused={
              this.state.audio_played == true &&
              this.props.audioState == this.state?.audiosArray[0]?.name
                ? false
                : true
            }
            repeat={false}
            ignoreSilentSwitch={"ignore"}
            playInBackground={false}
            onProgress={(ev) => this.onProgress(ev)}
            onEnd={this.onEnd}
          />

          <View style={styles.playerContentStyle}>
            {this.state.isDownloading ? (
              <View style={styles.audioPlayPauseBtnStyle}>
                <ActivityIndicator style={styles.audioMessageButton} />
              </View>
            ) : !this.state?.audiosArray[0]?.isDownloaded &&
              this.props.position === "left" ? (
              <TouchableOpacity
                style={styles.audioPlayPauseBtnStyle}
                onPress={() => this.downloadMedia("Audios")}
              >
                <Octicons name={"download"} size={20} color={"#000"} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.audioPlayPauseBtnStyle}
                onPress={this.playPauseAction}
              >
                <FontAwesome
                  name={this.state.audio_played ? "pause" : "play"}
                  size={20}
                  color={"#000"}
                />
              </TouchableOpacity>
            )}

            <View style={styles.seekSliderContainerStyle}>
              <Slider
                value={playWidth}
                minimumValue={0}
                maximumValue={100}
                style={styles.seekSliderStyle}
                trackStyle={styles.slidertrack}
                thumbStyle={styles.sliderThumbStyle}
                onSlidingComplete={(ev) => this.onSlidingComplete(ev)}
              />

              <View style={styles.durationTextContainerStyle}>
                <Text style={styles.audioMessageDetailText}>
                  {this.state.audio_played
                    ? this.state.audio_playTime
                    : this.state.pause_audio_played
                    ? this.state.audio_playTime
                    : showAudio.duration}
                </Text>
              </View>
            </View>

            <View style={styles.micContainerStyle}>
              <FontAwesome name={"microphone"} style={styles.micIcon} />
            </View>
          </View>
        </View>
      );
    } else if (this.props?.currentMessage?.type === 8) {
      let showReply = JSON.parse(this.props.currentMessage.message);
      if (showReply?.reply_message?.reply_type === 7) {
        let playWidth =
          (this.state.currentPositionSec / this.state.currentDurationSec) * 100;
        if (!playWidth) {
          playWidth = 0;
        }
        let showAudioReply = JSON.parse(
          showReply?.reply_message?.reply_content
        );
        return (
          <View style={styles[this.props.position].replyImageLinkStickerView}>
            <View
              style={[
                styles[this.props.position].replyImageStickerInner,
                { paddingVertical: "5%" },
              ]}
            >
              <Text
                style={styles[this.props.position].replyImageLinkStickerName}
              >
                You
              </Text>
              <View
                style={
                  styles[this.props.position].replyImageLinkStickerIconView
                }
              >
                <FontAwesome
                  name={"microphone"}
                  style={styles[this.props.position].replyImageStickerLinkIcon}
                />
                <Text>audio</Text>
              </View>
            </View>
          </View>
        );
      }
    } else if (this.props?.currentMessage?.type === 9) {
      let showAudio = JSON.parse(this.props.currentMessage.message);
      if (showAudio.type === 7) {
        let playWidth =
          (this.state.currentPositionSec / this.state.currentDurationSec) * 100;

        let localFile =
          this.props.position === "left"
            ? Platform.OS == "android"
              ? this.state?.audiosArray[0]?.name
              : "file://" + this.state?.audiosArray[0]?.name
            : appConfig.adiouPath + this.state?.audiosArray[0]?.name;

        if (!playWidth) {
          playWidth = 0;
        }

        return (
          <View style={styles.audioMessageView}>
            <Video
              ref={(videoRef) => (this.audioPlayerRef = videoRef)}
              source={{ uri: localFile }}
              style={styles.playerStyle}
              audioOnly={true}
              resizeMode={"contain"}
              controls={false}
              paused={
                this.state.audio_played == true &&
                this.props.audioState == this.state?.audiosArray[0]?.name
                  ? false
                  : true
              }
              repeat={false}
              ignoreSilentSwitch={"ignore"}
              playInBackground={false}
              onProgress={(ev) => this.onProgress(ev)}
              onEnd={this.onEnd}
            />

            <View style={styles.playerContentStyle}>
              {this.state.isDownloading ? (
                <View style={styles.audioPlayPauseBtnStyle}>
                  <ActivityIndicator style={styles.audioMessageButton} />
                </View>
              ) : !this.state?.audiosArray[0]?.isDownloaded &&
                this.props.position === "left" ? (
                <TouchableOpacity
                  style={styles.audioPlayPauseBtnStyle}
                  onPress={() => this.downloadMedia("Audios")}
                >
                  <Octicons name={"download"} size={20} color={"#000"} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.audioPlayPauseBtnStyle}
                  onPress={this.playPauseAction}
                >
                  <FontAwesome
                    name={this.state.audio_played ? "pause" : "play"}
                    size={20}
                    color={"#000"}
                  />
                </TouchableOpacity>
              )}

              <View style={styles.seekSliderContainerStyle}>
                <Slider
                  value={playWidth}
                  minimumValue={0}
                  maximumValue={100}
                  style={styles.seekSliderStyle}
                  trackStyle={styles.slidertrack}
                  thumbStyle={styles.sliderThumbStyle}
                  onSlidingComplete={(ev) => this.onSlidingComplete(ev)}
                />

                <View style={styles.durationTextContainerStyle}>
                  <Text style={styles.audioMessageDetailText}>
                    {this.state.audio_played
                      ? this.state.audio_playTime
                      : this.state.pause_audio_played
                      ? this.state.audio_playTime
                      : showAudio.duration}
                  </Text>
                </View>
              </View>

              <View style={styles.micContainerStyle}>
                <FontAwesome name={"microphone"} style={styles.micIcon} />
              </View>
            </View>
          </View>
        );
      }
    }
  }

  renderMessageReply() {
    if (this.props?.currentMessage?.type === 8) {
      let replyMsg = JSON.parse(this.props.currentMessage.message);
      if (parseInt(parseInt(replyMsg?.new_message.new_type)) === 1) {
        return (
          <View style={styles.messageSendReplyView}>
            {this.props.position === undefined ? (
              <CalculatedTextViewer
                message={replyMsg?.new_message.new_content}
                style={styles.sendReplyText}
              />
            ) : (
              <CalculatedTextViewer
                message={replyMsg?.new_message.new_content}
                style={styles[this.props.position].sendReplyText}
              />
            )}
          </View>
        );
      } else if (parseInt(replyMsg?.new_message.new_type) === 2) {
        let replyImageMsg = JSON.parse(
          replyMsg?.new_message.new_content
        ).content;
        let images = [];
        replyImageMsg.forEach((element) => {
          images.push({ uri: element });
        });
        return (
          <TouchableOpacity
            onPress={() => this.openImages(images)}
            onLongPress={this.longPressAction}
          >
            <ImageThumbnail
              images={images}
              msgType={2}
              msgPosition={this.props.position}
            />
          </TouchableOpacity>
        );
      } else if (parseInt(replyMsg?.new_message.new_type) === 3) {
        return (
          <View style={styles.imageMessageFlex}>
            <FastImage
              source={{ uri: replyMsg?.new_message.new_content }}
              style={{ height: "100%", width: "100%", borderRadius: 10 }}
            />
          </View>
        );
      } else if (parseInt(replyMsg?.new_message.new_type) === 4) {
        return (
          <View>
            <FastImage
              source={{
                uri: appConfig.stickers + replyMsg?.new_message.new_content,
              }}
              style={styles[this.props?.position]?.messageSticker}
            />
          </View>
        );
      } else if (parseInt(replyMsg?.new_message.new_type) === 5) {
        return (
          <View style={styles.messageLinkFlex}>
            <Text numberOfLines={1} style={{ color: "green" }}>
              {replyMsg?.new_message.new_content.url}
            </Text>
            <Text numberOfLines={3}>
              {replyMsg?.new_message.new_content.title}
            </Text>
          </View>
        );
      } else if (parseInt(replyMsg?.new_message.new_type) === 6) {
        let replyFileMsg = JSON.parse(
          replyMsg?.new_message.new_content
        ).content;
        return this.state?.filesArray ? (
          this.state?.filesArray.map((res, ind) => {
            return (
              <TouchableOpacity
                key={ind}
                style={styles.messageFileView}
                onPress={() => this.openFile(res)}
                onLongPress={this.longPressAction}
              >
                <View style={styles.messageFileFlex}>
                  <FileTypeIcon
                    data={res}
                    style={{
                      color: "red",
                      fontSize: 25,
                    }}
                  />
                  <Text style={styles[this.props?.position]?.fileNameText}>
                    {replyFileMsg[ind].name}
                  </Text>
                  {res.isDownloading ? (
                    <View style={{ padding: 5 }}>
                      <ActivityIndicator size={"small"} color={"#fff"} />
                    </View>
                  ) : !res?.isDownloaded && this.props.position === "left" ? (
                    <TouchableOpacity
                      style={{ padding: 5 }}
                      onPress={() => this.downloadMedia("Files")}
                    >
                      <FontAwesome5
                        name={"arrow-circle-o-down"}
                        size={23}
                        color={"grey"}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <Text style={styles[this.props?.position]?.fileSizeText}>
                  {res.size}
                </Text>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.messageFileView}>
            <Text style={{ fontWeight: "bold", color: "#000" }}>
              # FILE DECODE ERROR
            </Text>
          </View>
        );
      } else if (parseInt(replyMsg?.new_message.new_type) === 7) {
        let replyAudioMsg = JSON.parse(replyMsg?.new_message.new_content);
        let playWidth =
          (this.state.currentPositionSec / this.state.currentDurationSec) * 100;

        let localFile =
          this.props.position === "left"
            ? Platform.OS == "android"
              ? this.state?.audiosArray[0]?.name
              : "file://" + this.state?.audiosArray[0]?.name
            : appConfig.adiouPath + this.state?.audiosArray[0]?.name;

        if (!playWidth) {
          playWidth = 0;
        }
        return (
          <View style={styles.audioMessageView}>
            <Video
              ref={(videoRef) => (this.audioPlayerRef = videoRef)}
              source={{ uri: localFile }}
              style={styles.playerStyle}
              audioOnly={true}
              resizeMode={"contain"}
              controls={false}
              paused={
                this.state.audio_played == true &&
                this.props.audioState == this.state?.audiosArray[0]?.name
                  ? false
                  : true
              }
              repeat={false}
              ignoreSilentSwitch={"ignore"}
              playInBackground={false}
              onProgress={(ev) => this.onProgress(ev)}
              onEnd={this.onEnd}
            />

            <View style={styles.playerContentStyle}>
              {this.state.isDownloading ? (
                <View style={styles.audioPlayPauseBtnStyle}>
                  <ActivityIndicator style={styles.audioMessageButton} />
                </View>
              ) : !this.state?.audiosArray[0]?.isDownloaded &&
                this.props.position === "left" ? (
                <TouchableOpacity
                  style={styles.audioPlayPauseBtnStyle}
                  onPress={() => this.downloadMedia("Audios")}
                >
                  <Octicons name={"download"} size={20} color={"#000"} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.audioPlayPauseBtnStyle}
                  onPress={this.playPauseAction}
                >
                  <FontAwesome
                    name={this.state.audio_played ? "pause" : "play"}
                    size={20}
                    color={"#000"}
                  />
                </TouchableOpacity>
              )}

              <View style={styles.seekSliderContainerStyle}>
                <Slider
                  value={playWidth}
                  minimumValue={0}
                  maximumValue={100}
                  style={styles.seekSliderStyle}
                  trackStyle={styles.slidertrack}
                  thumbStyle={styles.sliderThumbStyle}
                  onSlidingComplete={(ev) => this.onSlidingComplete(ev)}
                />

                <View style={styles.durationTextContainerStyle}>
                  <Text style={styles.audioMessageDetailText}>
                    {this.state.audio_played
                      ? this.state.audio_playTime
                      : this.state.pause_audio_played
                      ? this.state.audio_playTime
                      : replyAudioMsg.duration}
                  </Text>
                </View>
              </View>

              <View style={styles.micContainerStyle}>
                <FontAwesome name={"microphone"} style={styles.micIcon} />
              </View>
            </View>
          </View>
        );
      } else if (parseInt(replyMsg?.new_message.new_type) === 11) {
        let replyVideoMsg = JSON.parse(
          replyMsg?.new_message.new_content
        ).content;
        return this.state?.videosArray ? (
          this.state?.videosArray.map((video, ind) => {
            let videoImageName =
              replyVideoMsg[ind]?.extenstion == "MOV"
                ? replyVideoMsg[ind]?.name.split(".MOV")[0]
                : replyVideoMsg[ind]?.name.split(".mp4")[0];
            return (
              <View
                key={ind}
                style={{
                  marginRight: 1,
                  borderRadius: 10,
                  marginTop: 5,
                  overflow: "hidden",
                }}
              >
                <CalculatedImageViewer
                  uri={`https://www.srplivehelp.com/media/chats/videos/${videoImageName}.png`}
                />
                {video.isDownloading ? (
                  <View style={styles.videoDownloadIcon}>
                    <ActivityIndicator size={"large"} color={"#fff"} />
                  </View>
                ) : !video?.isDownloaded && this.props.position === "left" ? (
                  <>
                    <TouchableOpacity
                      style={styles.videoDownloadIcon}
                      onPress={() => this.downloadMedia("Videos", ind)}
                    >
                      <FontAwesome5
                        name={"arrow-circle-o-down"}
                        size={50}
                        color={"grey"}
                      />

                      <Text style={styles.downloadText}>Download</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 10,
                        color: "white",
                        fontSize: 10,
                      }}
                    >
                      {video?.size}
                    </Text>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        let path =
                          this.props.position === "left"
                            ? video?.name
                            : appConfig.videoImagePath + video?.name;
                        this.props.navProps.navigate("MessagePreview", {
                          messageType: "Video",
                          videoPath: path,
                        });
                      }}
                      style={styles.videoPlayIcon}
                    >
                      <FontAwesome
                        name={"play-circle"}
                        size={40}
                        color={"white"}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 10,
                        color: "white",
                        fontSize: 10,
                      }}
                    >
                      {video?.size}
                    </Text>
                  </>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.messageFileView}>
            <Text style={{ fontWeight: "bold", color: "#000" }}>
              # ENCODING ERROR
            </Text>
          </View>
        );
      }
    }
  }

  renderMessageForward() {
    if (this.props?.currentMessage?.type === 9) {
      return (
        <View style={styles.messageForwardFlex}>
          <FastImage
            source={require("../assets/arrow.png")}
            style={styles.forwardIcon}
          />
          <Text style={styles.forwardText}>Forward</Text>
        </View>
      );
    } else if (this.props?.currentMessage?.type === 8) {
      let replyMsg = JSON.parse(this.props.currentMessage.message);
      if (replyMsg?.reply_message?.reply_type === 9) {
        return (
          <View style={styles[this.props.position].messageSelectedReplyDesign}>
            <Text style={styles[this.props.position].replyFormUsername}>
              {replyMsg?.reply_message?.reply_from}
            </Text>
            <View style={styles.messageForwardFlex}>
              <FastImage
                source={require("../assets/arrow.png")}
                style={styles.forwardIcon}
              />
              <Text style={styles.forwardText}>Forward</Text>
            </View>
          </View>
        );
      }
    }
    return null;
  }

  renderMessageVideo() {
    if (this.props?.currentMessage?.type === 11) {
      let showVideo = JSON.parse(this.props.currentMessage.message).content;
      return this.state?.videosArray ? (
        this.state?.videosArray.map((video, ind) => {
          let videoImageName = showVideo[ind].thumbnail;
          return (
            <View
              key={ind}
              style={{
                overflow: "hidden",
                marginRight: 1,
                borderRadius: 10,
                marginTop: ind > 0 ? 5 : 0,
              }}
            >
              <CalculatedImageViewer
                uri={`https://www.srplivehelp.com/media/chats/videos/${videoImageName}`}
              />
              {video.isDownloading ? (
                <View style={styles.videoDownloadIcon}>
                  <ActivityIndicator size={"large"} color={"#fff"} />
                </View>
              ) : !video?.isDownloaded && this.props.position === "left" ? (
                <>
                  <TouchableOpacity
                    style={styles.videoDownloadIcon}
                    onPress={() => this.downloadMedia("Videos", ind)}
                  >
                    <FontAwesome5
                      name={"arrow-circle-o-down"}
                      size={50}
                      color={"grey"}
                    />
                    <Text style={styles.downloadText}>Download</Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 10,
                      color: "white",
                      fontSize: 10,
                    }}
                  >
                    {video?.size}
                  </Text>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      let path = video?.name;
                      this.props.navProps.navigate("MessagePreview", {
                        messageType: "Video",
                        videoPath: path,
                      });
                    }}
                    style={styles.videoPlayIcon}
                  >
                    <FontAwesome
                      name={"play-circle"}
                      size={40}
                      color={"white"}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 10,
                      color: "white",
                      fontSize: 10,
                    }}
                  >
                    {video?.size}
                  </Text>
                </>
              )}
            </View>
          );
        })
      ) : (
        <View style={styles.messageFileView}>
          <Text style={{ fontWeight: "bold", color: "#000" }}>
            # ENCODING ERROR
          </Text>
        </View>
      );
    } else if (this.props?.currentMessage?.type === 8) {
      let showReply = JSON.parse(this.props.currentMessage.message);
      if (showReply?.reply_message?.reply_type === 11) {
        let showVideoReply = JSON.parse(showReply?.reply_message?.reply_content)
          .content[0];
        let videoImageName = showVideoReply.thumbnail;
        return (
          <View style={styles[this.props.position].replyImageLinkStickerView}>
            <View style={{ marginRight: "40%" }}>
              <View style={styles[this.props.position].replyImageStickerInner}>
                <Text
                  style={styles[this.props.position].replyImageLinkStickerName}
                >
                  {showReply?.reply_message?.reply_from}
                </Text>
                <View
                  style={
                    styles[this.props.position].replyImageLinkStickerIconView
                  }
                >
                  <FontAwesome
                    name={"video"}
                    style={
                      styles[this.props.position].replyImageStickerLinkIcon
                    }
                  />
                  <Text>Video</Text>
                </View>
              </View>
            </View>
            <View style={styles.replyVideoImage}>
              <FastImage
                source={{
                  uri: `https://www.srplivehelp.com/media/chats/videos/${videoImageName}`,
                }}
                style={styles[this.props.position].replyStickerLinkImage}
              />
            </View>
          </View>
        );
      }
    } else if (this.props?.currentMessage?.type === 9) {
      let showVideo = JSON.parse(this.props?.currentMessage?.message);
      if (showVideo?.type === 11) {
        let showVideoMsg = JSON.parse(showVideo.message).content;
        return this.state?.videosArray ? (
          this.state?.videosArray.map((video, ind) => {
            let videoImageName = showVideoMsg?.[ind]?.thumbnail;
            return (
              <View
                key={ind}
                style={{
                  overflow: "hidden",
                  marginRight: 1,
                  borderRadius: 10,
                  marginTop: 5,
                }}
              >
                <CalculatedImageViewer
                  uri={`https://www.srplivehelp.com/media/chats/videos/${videoImageName}`}
                />
                {video.isDownloading ? (
                  <View style={styles.videoDownloadIcon}>
                    <ActivityIndicator size={"large"} color={"#fff"} />
                  </View>
                ) : !video?.isDownloaded && this.props.position === "left" ? (
                  <>
                    <TouchableOpacity
                      style={styles.videoDownloadIcon}
                      onPress={() => this.downloadMedia("Videos", ind)}
                    >
                      <FontAwesome5
                        name={"arrow-circle-o-down"}
                        size={50}
                        color={"grey"}
                      />
                      <Text style={styles.downloadText}>Download</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 10,
                        color: "white",
                        fontSize: 10,
                      }}
                    >
                      {video?.size}
                    </Text>
                  </>
                ) : (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        let path =
                          this.props.position === "left"
                            ? video?.name
                            : appConfig.videoImagePath + video?.name;
                        this.props.navProps.navigate("MessagePreview", {
                          messageType: "Video",
                          videoPath: path,
                        });
                      }}
                      style={styles.videoPlayIcon}
                    >
                      <FontAwesome
                        name={"play-circle"}
                        size={40}
                        color={"white"}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 10,
                        color: "white",
                        fontSize: 10,
                      }}
                    >
                      {video?.size}
                    </Text>
                  </>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.messageFileView}>
            <Text style={{ fontWeight: "bold", color: "#000" }}>
              # ENCODING ERROR
            </Text>
          </View>
        );
      }
    }
  }

  renderCall() {
    if (this.props?.currentMessage?.type === 10) {
      let iconsize = 22;
      return (
        <View style={styles.callView}>
          <View style={styles.callIconViewInner}>
            {this.props.position === "left" ? (
              JSON.parse(this.props?.currentMessage.message).call_type == 1 ? (
                <SimpleLineIcons
                  name={"call-in"}
                  style={styles.callIcon}
                  size={iconsize}
                  color={"white"}
                />
              ) : (
                <MaterialIcons
                  name={"missed-video-call"}
                  style={styles.callIcon}
                  size={iconsize}
                  color={"white"}
                />
              )
            ) : JSON.parse(this.props?.currentMessage.message).call_type ==
              1 ? (
              <SimpleLineIcons
                name={"call-out"}
                style={styles.callIcon}
                size={iconsize}
                color={"white"}
              />
            ) : (
              <MaterialIcons
                name={"missed-video-call"}
                style={styles.callIcon}
                size={iconsize}
                color={"white"}
              />
            )}
          </View>
          {JSON.parse(this.props?.currentMessage.message).call_type == 1 ? (
            JSON.parse(this.props?.currentMessage.message).duration == 0 &&
            this.props.position === "left" ? (
              <Text>Missed Audio Call</Text>
            ) : (
              <Text>Audio Call</Text>
            )
          ) : JSON.parse(this.props?.currentMessage.message).duration == 0 &&
            this.props.position === "left" ? (
            <Text>Missed Video Call</Text>
          ) : (
            <Text>Video Call</Text>
          )}
        </View>
      );
    }
  }

  renderStarAction() {
    return <FontAwesome5 name={"star"} color="#FDD833" size={15} />;
  }

  renderResponseLaterAction() {
    return <FontAwesome name={"history"} color="#93C6DC" size={15} />;
  }

  renderRemindAction() {
    return <FontAwesome name={"bell"} color="#93C6DC" size={15} />;
  }

  renderBubbleContent(action = false) {
    if (this.props.isEdited) {
      this.setMessagesInState();
    }

    let caption = "";
    let encodedMessage = true;
    if (
      this.props?.currentMessage?.type === 2 ||
      this.props?.currentMessage?.type === 6 ||
      this.props?.currentMessage?.type === 11
    ) {
      caption = JSON.parse(this.props?.currentMessage.message).caption;
    } else if (this.props?.currentMessage?.type === 8) {
      let msg = JSON.parse(this.props?.currentMessage.message).new_message;
      if (
        JSON.parse(this.props?.currentMessage.message).reply_message
          ?.reply_type == 8
      ) {
        encodedMessage = false;
      }

      if (msg.new_type === 2 || msg.new_type === 6 || msg.new_type === 11) {
        let msg2 = JSON.parse(msg.new_content);
        caption = msg2.caption;
      }
    } else if (this.props?.currentMessage?.type === 9) {
      let msg = JSON.parse(this.props?.currentMessage.message);
      if (msg.type === 2 || msg.type === 6 || msg.type === 11) {
        let msg2 = JSON.parse(msg.message);
        caption = msg2.caption;
      }
    }
    if (action) {
      return (
        <>
          <View>
            {this.props?.currentMessage?.chat_type === "group" &&
            this.props?.position === "left" ? (
              <Text>
                {this.props?.currentMessage?.first_name +
                  " " +
                  this.props?.currentMessage?.last_name}
              </Text>
            ) : null}
            {encodedMessage ? (
              <>
                {this.renderMessageForward()}
                {this.renderMessageText()}
                {this.renderMessageLink()}
                {this.renderMessageImage()}
                {this.renderMessageGif()}
                {this.renderMessageFile()}
                {this.renderMessageSticker()}
                {this.renderMessageAudio()}
                {this.renderMessageVideo()}
                {this.renderMessageReply()}
                {this.renderCall()}
              </>
            ) : (
              <Text
                style={{ marginBottom: 15, padding: 5, fontWeight: "bold" }}
              >
                #ENCODED_ERROR
              </Text>
            )}
          </View>
          {caption !== "" && caption !== undefined && (
            <Text style={{ padding: 5, color: "#000" }}>{caption}</Text>
          )}
        </>
      );
    } else {
      return (
        <>
          <View>
            {this.props?.currentMessage?.chat_type === "group" &&
            this.props?.position === "left" ? (
              <Text>
                {this.props?.currentMessage?.first_name +
                  " " +
                  this.props?.currentMessage?.last_name}
              </Text>
            ) : null}

            {encodedMessage ? (
              <>
                {this.renderMessageForward()}
                {this.renderMessageText()}
                {this.renderMessageLink()}
                {this.renderMessageImage()}
                {this.renderMessageGif()}
                {this.renderMessageFile()}
                {this.renderMessageSticker()}
                {this.renderMessageAudio()}
                {this.renderMessageVideo()}
                {this.renderMessageReply()}
                {this.renderCall()}
              </>
            ) : (
              <Text
                style={{ marginBottom: 15, padding: 5, fontWeight: "bold" }}
              >
                #ENCODED_ERROR
              </Text>
            )}
          </View>
          {caption !== "" && caption !== undefined && (
            <Text style={{ padding: 5, color: "#000" }}>{caption}</Text>
          )}
          <View style={styles[this.props.position].RespondRemindStar}>
            {this.props.currentMessage?.my_star === 1 &&
              this.renderStarAction()}
            {this.props.currentMessage?.is_reply_later === 1 &&
              this.renderResponseLaterAction()}
            {this.props.currentMessage?.is_set_remind === 1 &&
              this.renderRemindAction()}
          </View>
        </>
      );
    }
  }

  renderTicks() {
    if (this.props.currentMessage.status === 0) {
      return <Icon name="check" size={15} color="#979797" />;
    } else if (this.props.currentMessage.status === 1) {
      return <Icon name="done-all" size={15} color="#979797" />;
    } else if (this.props.currentMessage.status === 2) {
      return <Icon name="done-all" size={15} color="#547fff" />;
    }
  }

  renderTime() {
    if (this.props.currentMessage) {
      var m = moment.tz(this.props?.currentMessage?.time, "UTC").format();
      let f = moment.tz(m, LocalTimeZone.getTimeZone()).format("LT");
      return (
        <View style={styles[this.props.position].dateAndTimeFlex}>
          {f !== "Invalid date" ? (
            <>
              {this.props?.currentMessage?.is_edited === 1 &&
              this.props.position === "left" ? (
                <FontAwesome
                  name="pen-fancy"
                  size={10}
                  color="#c2c2c2"
                  style={{ marginHorizontal: 1 }}
                />
              ) : null}
              <Text
                style={
                  this.props?.currentMessage?.type == 2
                    ? styles[this.props.position].timeTextImage
                    : styles[this.props.position].timeText
                }
              >
                {f}
              </Text>
              {this.props?.currentMessage?.is_edited === 1 &&
              this.props.position === "right" ? (
                <FontAwesome
                  name="pen-fancy"
                  size={10}
                  color="#c2c2c2"
                  style={{ marginHorizontal: 1 }}
                />
              ) : null}
            </>
          ) : (
            <FontAwesome
              name={"clock"}
              style={styles[this.props.position].timeText}
            />
          )}
          {this.props.position === "right" && this.renderTicks()}
        </View>
      );
    }
    return null;
  }

  RenderDeletedMessage = () => {
    return (
      <View style={{ display: "flex" }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 5,
            marginBottom: 20,
          }}
        >
          <FontAwesome5
            name={"ban"}
            style={{
              color: "gray",
              fontSize: 16,
              marginRight: 5,
            }}
          />
          <Text style={{ color: "gray" }}>
            {this.props.currentMessage.sender_id == this.props.userData?.user.id
              ? "You deleted this message"
              : "This message was deleted"}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    let messageStyle = false;
    if (
      this.props.currentMessage.type == 2 ||
      this.props.currentMessage.type == 3 ||
      this.props.currentMessage.type == 11
    ) {
      messageStyle = true;
    } else if (this.props.currentMessage.type == 9) {
      messageStyle = false;
      let farward = JSON.parse(this.props?.currentMessage?.message)?.type;
      if (farward != 1 && farward != 7 && farward != 6) {
        messageStyle = true;
      }
    } else if (this.props.currentMessage.type == 8) {
      let reply = JSON.parse(this.props.currentMessage.message).new_message
        .new_type;
      if (reply != 1) messageStyle = true;
    }
    const { position, containerStyle, wrapperStyle, starredList } = this.props;
    if (starredList) {
      return this.renderBubbleContent(true);
    } else {
      return (
        <View
          style={[
            styles[position].container,
            containerStyle && containerStyle[position],
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {this.props.currentMessage.ack_required === 1 &&
              this.props.position === "right" && (
                <FontAwesome
                  name={
                    this.props.currentMessage.ack_count === 1
                      ? "envelope-open"
                      : "envelope"
                  }
                  color="grey"
                  size={25}
                  style={{ marginLeft: 10 }}
                />
              )}

            <TouchableWithoutFeedback
              onLongPress={() => {
                this.props.onSetOnLongPress([this.props?.currentMessage]);
              }}
              onPress={async () => {
                if (this.props.longPress.length !== 0) {
                  this.props.onSetOnLongPress([
                    this.props.currentMessage,
                    ...this.props.longPress,
                  ]);
                } else {
                  if (this.props?.currentMessage.type === 8) {
                    let replyMsg = JSON.parse(
                      this.props.currentMessage.message
                    );
                    this.props.onSetReplyNavigate(replyMsg);
                  }
                }
              }}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <View
                style={[
                  styles[position].wrapper,
                  wrapperStyle && wrapperStyle[position],
                ]}
              >
                {this.props.currentMessage.status == 3
                  ? this.RenderDeletedMessage()
                  : this.renderBubbleContent()}
                <View
                  style={[
                    messageStyle
                      ? { position: "absolute", bottom: 8, right: 5 }
                      : { alignSelf: "flex-end" },
                  ]}
                >
                  {this.renderTime()}
                </View>
              </View>
            </TouchableWithoutFeedback>
            {this.props.currentMessage.ack_required === 1 &&
              this.props.position === "left" && (
                <FontAwesome
                  name={
                    this.props.currentMessage.ack_count === 1
                      ? "envelope-open"
                      : "envelope"
                  }
                  color="grey"
                  size={25}
                />
              )}
          </View>
        </View>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme,
    userData: state.auth.user,
    longPress: state.messages.longPress,
    audioState: state.stateHandler.audioPlayState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetOnLongPress: (video) => {
      dispatch(setOnLongPress(video));
    },
    onSetReplyNavigate: (images) => {
      dispatch(setReplyNavigate(images));
    },
    onSetAudioPlayState: (url) => {
      dispatch(setAudioPlayState(url));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageBubble);

const styles = {
  callView: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: "5%",
  },
  callIcon: {
    marginHorizontal: windowWidth * 0.003,
    marginVertical: windowWidth * 0.003,
    padding: 10,
  },
  callIconViewInner: {
    borderRadius: 30,
    backgroundColor: "#008069",
    marginRight: windowWidth * 0.02,
  },
  videoImageMessageFlex: {
    maxWidth: windowWidth * 0.8,
    minWidth: 290,
    maxWidth: windowHeight * 0.6,
    minHeight: 290,
  },
  videoPlayIcon: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  videoDownloadIcon: {
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  messageSendReplyImage: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  messageLinkFlex: {
    padding: 5,
  },
  messageForwardFlex: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: "1%",
  },
  forwardText: {
    fontStyle: "italic",
    color: "#ABC297",
  },
  forwardIcon: {
    height: 10,
    width: 15,
    marginRight: 5,
    marginLeft: 2,
  },
  messageFileView: {
    paddingBottom: 20,
    padding: 5,
    width: windowWidth * 0.7,
  },
  messageSendReplyView: {
    padding: 5,
  },
  messageFileFlex: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d3eebe",
    padding: 5,
    borderRadius: 5,
  },
  imageMessageFlex: {
    maxWidth: 300,
    minWidth: 290,
    maxHeight: 300,
    minHeight: 290,
    borderRadius: 10,
  },
  ticksImage: {
    height: 10,
    width: 15,
  },
  messageTextFlex: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
  },
  messageText: {
    paddingHorizontal: "2%",
    paddingTop: 0,
    fontSize: 17,
    fontFamily: "Roboto-Regular",
    color: "black",
  },

  audioMessageView: {
    width: windowWidth * 0.8,
  },

  playerStyle: {
    width: "98%",
    height: 45,
    marginBottom: 2,
  },

  playerContentStyle: {
    position: "absolute",
    width: "98%",
    height: "100%",
    flexDirection: "row",
  },

  audioPlayPauseBtnStyle: {
    height: "100%",
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },

  seekSliderContainerStyle: { width: "76%" },
  seekSliderStyle: { height: "100%" },
  slidertrack: { backgroundColor: "#E6E6E6" },

  sliderThumbStyle: {
    backgroundColor: "#30B6F6",
    width: 12,
    height: 12,
  },

  durationTextContainerStyle: { marginTop: -15 },

  audioMessageDetailText: {
    fontSize: 10,
    fontFamily: "Roboto-Regular",
  },

  micContainerStyle: {
    backgroundColor: "green",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 3,
  },

  micIcon: {
    color: "white",
    fontSize: 20,
  },

  audioMessageButton: {
    color: "gray",
    fontSize: 25,
    padding: 5,
    alignSelf: "center",
  },

  audioMessagemainView: {
    borderRadius: 3,
    marginLeft: "1%",
  },

  audioMessageSliderAndIconView: {
    flexDirection: "row",
    alignItems: "center",
  },

  audioMessageSlider: {
    width: "100%",
    height: 25,
  },

  audioMessagedetailView: {
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  gridImageStyle: {
    borderRadius: 10,
  },

  captionStyle: {
    paddingHorizontal: 10,
    paddingVertical: 3,
  },

  replyVideoImage: {
    borderRadius: 10,
    width: 60,
    height: 60,
    overflow: "hidden",
  },

  downloadText: {
    color: "#fff",
    fontSize: 15,
  },

  left: StyleSheet.create({
    container: {
      alignItems: "flex-start",
    },
    dateAndTimeFlex: {
      flexDirection: "row",
      alignItems: "center",
      // marginRight: 5,
    },
    wrapper: {
      borderRadius: 10,
      backgroundColor: "white",
      paddingVertical: 7,
      minWidth: 100,
      maxWidth: windowWidth * 0.8,
      shadowOpacity: 0.3,
      shadowRadius: 2,
      shadowOffset: {
        height: 0.5,
        width: 0.1,
      },
      paddingHorizontal: "1%",
    },
    containerToNext: {
      borderBottomLeftRadius: 3,
    },
    containerToPrevious: {
      borderTopLeftRadius: 3,
    },
    bottom: {
      flexDirection: "row",
      justifyContent: "flex-start",
    },
    timeText: {
      marginRight: 10,
      fontSize: 10,
      color: "grey",
    },
    timeTextImage: {
      marginRight: 10,
      fontSize: 10,
      color: "grey",
    },
    messageImage: {
      height: "100%",
      width: "99%",
      borderRadius: 5,
    },
    fileNameText: {
      width: "75%",
      marginLeft: "3%",
      // marginRight: '10%',
      fontFamily: "Roboto-Regular",
    },
    sendReplyText: {
      fontFamily: "Roboto-Regular",
      fontSize: 17,
      color: "black",

      // backgroundColor:'red'
    },
    fileSizeText: {
      position: "absolute",
      bottom: 0,
      fontSize: 12,
      paddingLeft: 10,
      fontFamily: "Roboto-Regular",
    },
    messageSticker: {
      height: 100,
      width: 100,
    },
    messageLink: {
      height: 200,
      width: 200,
    },
    messageSelectedReplyDesign: {
      backgroundColor: "#e3e6e1",
      margin: 5,
      borderBottomLeftRadius: 10,
      borderTopLeftRadius: 10,
      borderLeftWidth: 5,
      borderLeftColor: "#35CD96",
      borderRadius: 5,
      paddingVertical: 10,
    },
    replyFormUsername: {
      color: "#35CD96",
      marginLeft: 5,
      fontFamily: "Roboto-Regular",
    },
    replyImageLinkStickerView: {
      flexDirection: "row",
      // minWidth: '100%',
      backgroundColor: "#e3e6e1",
      // maxWidth: '85%',
      justifyContent: "space-between",
      borderLeftColor: "#35CD96",
      borderBottomLeftRadius: 10,
      borderTopLeftRadius: 10,
      alignItems: "center",
      borderLeftWidth: 5,
    },
    replyImageStickerInner: {
      marginLeft: "5%",
    },
    replyImageLinkStickerName: {
      color: "#35CD96",
      fontWeight: "bold",
      fontFamily: "Roboto-Regular",
    },
    replyImageLinkStickerIconView: {
      flexDirection: "row",
      alignItems: "center",
    },
    replyImageStickerLinkIcon: {
      color: "grey",
      fontSize: 14,
      marginRight: 5,
    },
    replyStickerLinkImage: {
      width: 60,
      height: 60,
    },
    FileView: {
      backgroundColor: "#F7F7F7",
      borderLeftWidth: 5,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      borderLeftColor: "#35CD96",
      minWidth: 150,
      paddingVertical: 10,
    },
    FileViewText: {
      color: "black",
      fontWeight: "bold",
      fontFamily: "Roboto-Regular",
    },
    FileIconView: {
      flexDirection: "row",
      marginTop: 2,
    },
    FileIcon: {
      color: "black",
      fontSize: 15,
    },
    RespondRemindStar: {
      marginLeft: "5%",
      flexDirection: "row",
      alignItems: "center",
      // minWidth:100
      marginRight: 70,
    },
  }),
  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "flex-end",
    },
    dateAndTimeFlex: {
      flexDirection: "row",
      alignItems: "center",
      // marginRight: 5,
    },
    wrapper: {
      borderRadius: 10,
      // marginBottom: -10,
      backgroundColor: "#e7ffdb",
      // marginLeft: 10,
      minHeight: 20,
      marginRight: 0,
      maxWidth: "85%",
      // minWidth: "0%",
      shadowOpacity: 0.3,
      shadowRadius: 2,
      shadowOffset: {
        height: 0.5,
        width: 0.1,
      },
      paddingVertical: "2%",
      paddingHorizontal: "1%",
    },
    containerToNext: {
      borderBottomRightRadius: 3,
    },
    containerToPrevious: {
      borderTopRightRadius: 3,
    },
    bottom: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    timeText: {
      marginRight: 2,
      fontSize: 10,
      color: "grey",
    },
    timeTextImage: {
      marginRight: 10,
      fontSize: 10,
      color: "grey",
    },
    messageImage: {
      height: "100%",
      width: "100%",
      borderRadius: 5,
    },
    fileNameText: {
      width: "65%",
      marginLeft: "3%",
      // marginRight: '10%',
      fontFamily: "Roboto-Regular",
    },
    sendReplyText: {
      fontFamily: "Roboto-Regular",
      fontSize: 17,
      color: "black",
    },
    fileSizeText: {
      position: "absolute",
      bottom: 0,
      fontSize: 12,
      paddingLeft: 10,
      fontFamily: "Roboto-Regular",
    },
    messageSticker: {
      height: 100,
      width: 100,
    },
    messageSelectedReplyDesign: {
      backgroundColor: "#D3EEBE",
      margin: 5,
      borderBottomLeftRadius: 10,
      borderLeftWidth: 3,
      borderLeftColor: "#6BCBEF",
      borderRadius: 5,
      borderTopLeftRadius: 10,
      paddingVertical: 10,
    },
    replyFormUsername: {
      color: "#6BCBEF",
      marginLeft: 5,
    },
    messageLink: {
      height: 200,
      width: 200,
    },
    replyImageLinkStickerView: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderLeftColor: "#6BCBEF",
      borderBottomLeftRadius: 10,
      borderTopLeftRadius: 10,
      alignItems: "center",
      borderLeftWidth: 5,
      backgroundColor: "#D3EEBE",
    },
    replyImageStickerInner: {
      marginLeft: "5%",
    },
    replyImageLinkStickerName: {
      color: "#6BCBEF",
      fontWeight: "bold",
    },
    replyImageLinkStickerIconView: {
      flexDirection: "row",
      alignItems: "center",
    },
    replyImageStickerLinkIcon: {
      color: "grey",
      fontSize: 14,
      marginRight: 5,
      fontFamily: "Roboto-Regular",
    },
    replyStickerLinkImage: {
      width: 60,
      height: 60,
    },
    FileView: {
      borderLeftWidth: 5,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      borderLeftColor: "#6BCBEF",
      minWidth: 150,
      paddingVertical: 10,
    },
    FileViewText: {
      color: "black",
      fontWeight: "bold",
      fontFamily: "Roboto-Regular",
    },
    FileIconView: {
      flexDirection: "row",
      marginTop: 2,
    },
    FileIcon: {
      color: "black",
      fontSize: 15,
    },
    RespondRemindStar: {
      marginRight: "30%",
      flexDirection: "row",
      alignItems: "center",
    },
  }),
  content: StyleSheet.create({
    tick: {
      fontSize: 10,
      backgroundColor: Color.backgroundTransparent,
      color: Color.white,
      fontFamily: "Roboto-Regular",
    },
    unReadTick: { color: "black" },
    ReadTick: { color: Color.green },
    tickView: {
      flexDirection: "row",
      marginRight: 0,
    },
    username: {
      top: -3,
      left: 0,
      fontSize: 12,
      backgroundColor: "transparent",
      color: "#aaa",
      fontFamily: "Roboto-Regular",
    },
    usernameView: {
      flexDirection: "row",
      marginHorizontal: 10,
    },
    timeVideoAndAudio: {
      position: "absolute",
      bottom: 8,
      // right: 0,
      color: "white",
      backgroundColor: "red",
    },
  }),
};
