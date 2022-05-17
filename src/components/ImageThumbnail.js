import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/FontAwesome";
import appConfig from "../utils/appConfig";
import { onDownload } from "../utils/regex";
import RNFetchBlob from "rn-fetch-blob";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const { config, fs } = RNFetchBlob;
const { dirs } = RNFetchBlob.fs;
export default class ImageThumbnail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesArray: [],
      isDownloading: false,
      currentImage: null,
      calcImgHeight: 0,
      width: 0,
      height: 0,
      desiredHeight: 0,
    };
  }

  componentDidMount = () => {
    this.setImagesInState();
    this.checkExisingImages();
  };

  setImagesInState = () => {
    let img = this.props?.images;
    img.forEach((img) => {
      this.state.imagesArray.push({ uri: img.uri, isDownloaded: true });
    });
  };

  RemoteImage = ({ uri, desiredWidth }) => {
    Image.getSize(uri, (width, height) => {
      this.setState({
        desiredHeight: (desiredWidth / width) * height,
      });
    });

    return (
      <Image
        source={{ uri }}
        style={{
          borderWidth: 1,
          width: desiredWidth,
          height: this.state.desiredHeight,
        }}
      />
    );
  };

  demo = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <this.RemoteImage
          uri="https://via.placeholder.com/350x150"
          desiredWidth={200}
        />
      </View>
    );
  };

  donwloadImages = () => {
    this.setState({ isDownloading: true });
    let imgArray = this.state?.imagesArray;
    if (Platform.OS == "android") {
      imgArray.forEach((img) => {
        if (!img.isDownloaded) {
          onDownload.downloadFile(img.uri, "Images", (res) => {
            if (res) {
              let ind = this.state.imagesArray.indexOf(img);
              imgArray[ind].uri = "file://" + res.data;
              imgArray[ind].isDownloaded = true;
              this.setState({ imagesArray: imgArray, isDownloading: false });
            }
          });
        }
      });
    } else {
      imgArray.forEach((img) => {
        if (!img.isDownloaded) {
          onDownload.downloadFileIos(img.uri, "Images", (res) => {
            if (res) {
              let ind = this.state.imagesArray.indexOf(img);
              imgArray[ind].uri = res.data;
              imgArray[ind].isDownloaded = true;
              this.setState({ imagesArray: imgArray, isDownloading: false });
            }
          });
        }
      });
    }
  };

  checkExisingImages = () => {
    let imgArray = this.state?.imagesArray;
    if (this.props.msgPosition == "left") {
      imgArray.forEach((img) => {
        onDownload.checkExistingMedia(img.uri, "Images").then((res) => {
          if (Platform.OS == "android") {
            let ind = this.state.imagesArray.indexOf(img);
            imgArray[ind].uri = res
              ? "file://" + appConfig.localPath + "Images/" + img.uri
              : img.uri;
            imgArray[ind].isDownloaded = res;
            this.setState({ imagesArray: imgArray });
          } else {
            let ind = this.state.imagesArray.indexOf(img);
            imgArray[ind].uri = res
              ? fs.dirs.DocumentDir + "/srp_live/Images/" + img.uri
              : img.uri;
            imgArray[ind].isDownloaded = res;
            this.setState({ imagesArray: imgArray });
          }
        });
      });
    } else {
      imgArray.forEach((img) => {
        onDownload.checkExistingMediaSend(img.uri, "Images").then((res) => {
          if (Platform.OS == "android") {
            let ind = this.state.imagesArray.indexOf(img);
            imgArray[ind].uri = res
              ? "file://" + appConfig.localPath + "Images/Sent/" + img.uri
              : img.uri;
            imgArray[ind].isDownloaded = res;
            this.setState({ imagesArray: imgArray });
          } else {
            let ind = this.state.imagesArray.indexOf(img);
            imgArray[ind].uri = res
              ? fs.dirs.DocumentDir + "/srp_live/Images/Sent/" + img.uri
              : img.uri;
            imgArray[ind].isDownloaded = res;
            this.setState({ imagesArray: imgArray });
          }
        });
      });
    }
  };
  ImageCalculateHeight = (img) => {
    try {
      let heightWidth = img.uri.slice(
        img.uri.lastIndexOf("_") + 1,
        img.uri.lastIndexOf(".")
      );
      return parseInt(
        heightWidth.slice(heightWidth.indexOf("x") + 1, heightWidth.length)
      );
    } catch (e) {
      console.log("error", img, e);
      return 20;
    }
  };
  ImageCalculateWidth = (img) => {
    try {
      let heightWidth = img.uri.slice(
        img.uri.lastIndexOf("_") + 1,
        img.uri.lastIndexOf(".")
      );
      return parseInt(heightWidth.slice(0, heightWidth.indexOf("x")));
    } catch (e) {
      console.log("error", img, e);
      return 20;
    }
  };
  render() {
    const { msgType, msgPosition } = this.props;
    const radiusValue = this.props.size ? 3 : 10;
    const maxWidth = this.props.size ? this.props.size : 300;
    const maxHeight = this.props.size ? this.props.size : 300;
    const minWidth = this.props.size ? this.props.size : 290;
    const minHeight = this.props.size ? this.props.size : 290;
    const iconSize = 50;
    const singleImageWidth = windowWidth * 0.65;
    const multipleImagesWidth = (windowWidth * 0.77) / 2;

    console.log("singleImageWidth", singleImageWidth);

    const styles = StyleSheet.create({
      imageMessageSingleFlex: {
        // backgroundColor: "yellow",
        width: singleImageWidth,
        display: "flex",
        flex: 1,
        justifyContent: "flex-end",
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: "auto",
        maxWidth: windowWidth * 0.7,
        // minWidth: minWidth,
        maxHeight: windowHeight * 0.63,
        // minHeight: minHeight,
        borderRadius: radiusValue,
        overflow: "hidden",
      },
      imageMessageFlex: {
        maxWidth: windowWidth * 0.85,
        // minWidth: windowWidth * 0.85,
        maxHeight: windowWidth * 0.85,
        // minHeight: windowWidth * 0.85,
        borderRadius: radiusValue,
      },
      replyImageMessageFlex: {
        maxWidth: maxWidth,
        minWidth: minWidth,
        maxHeight: maxHeight,
        minHeight: minHeight,
        borderRadius: radiusValue,
      },
      bgImg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        backgroundColor: "rgba(52, 52, 52, 0.8)",
      },

      downloadText: {
        color: "#fff",
        fontSize: 15,
      },

      fastImageStyleOneImg: {
        borderRadius: 10,
        // height: msgType === 8 ? '95%' : this.state.calcImgHeight,
        // width: msgType === 8 ? '95%' : singleImageWidth,
        borderRadius: radiusValue,
      },

      fastImageStyleTwoImg: {
        height: msgType === 8 ? "45%" : "49.2%",
        width: msgType === 8 ? "95%" : singleImageWidth,
        margin: 1,
        borderRadius: radiusValue,
      },

      fastImageStyleThreeImgLeft: {
        height: msgType === 8 ? "45%" : "49.2%",
        width: msgType === 8 ? "45%" : multipleImagesWidth,
        margin: 1,
        borderRadius: radiusValue,
      },

      fastImageStyleThreeImgRight: {
        height: msgType === 8 ? "95%" : "99%",
        width: msgType === 8 ? "45%" : multipleImagesWidth,
        margin: 1,
        borderRadius: radiusValue,
      },

      fastImageStyleFiveImgRight: {
        height: msgType === 8 ? "28%" : "32.5%",
        width: msgType === 8 ? "45%" : multipleImagesWidth,
        margin: 1,
        borderRadius: radiusValue,
      },

      imageBackgroundSixPlus: {
        alignItems: "center",
        justifyContent: "center",
      },

      imageBackgroundSixPlusTextStyle: {
        fontSize: 50,
        color: "#fff",
        fontWeight: "bold",
      },
    });

    if (this.state?.imagesArray.length == 1) {
      return this.state?.imagesArray.map((img, ind) => {
        return (
          <View
            key={ind}
            style={[
              msgType === 8
                ? styles.replyImageMessageFlex
                : [
                    styles.imageMessageSingleFlex,
                    {
                      height:
                        (this.ImageCalculateHeight(img) /
                          this.ImageCalculateWidth(img)) *
                        windowWidth *
                        0.66,
                    },
                  ],
            ]}
          >
            <FastImage
              source={{
                uri: img.isDownloaded ? img.uri : appConfig.imagePath + img.uri,
              }}
              style={[
                styles.fastImageStyleOneImg,
                {
                  height: msgType === 8 ? "95%" : "100%",

                  //  this.state.calcImgHeight
                  width: msgType === 8 ? "95%" : "100%",
                },
              ]}
              resizeMode="stretch"
              // onLoad={evt =>
              //   this.setState({
              //     calcImgHeight:
              //       (evt.nativeEvent.height / evt.nativeEvent.width) *
              //       windowWidth *
              //       0.85, // By this, you keep the image ratio
              //   })
              // }
            />
            {this.state.isDownloading ? (
              <View style={styles.bgImg}>
                <ActivityIndicator size={"large"} color={"#fff"} />
              </View>
            ) : !img.isDownloaded &&
              msgPosition === "left" &&
              (msgType === 2 || msgType === 9) ? (
              <TouchableOpacity
                style={styles.bgImg}
                onPress={this.donwloadImages}
              >
                <Icon
                  name={"arrow-circle-down"}
                  size={iconSize}
                  color={"#fff"}
                />
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        );
      });
    } else if (this.state?.imagesArray.length == 2) {
      return (
        <View
          style={
            msgType === 8
              ? styles.replyImageMessageFlex
              : styles.imageMessageFlex
          }
        >
          {this.state?.imagesArray.map((img, ind) => {
            return (
              <>
                <FastImage
                  key={ind}
                  source={{
                    uri: img.isDownloaded
                      ? img.uri
                      : appConfig.imagePath + img.uri,
                  }}
                  style={[
                    styles.fastImageStyleTwoImg,
                    ind == 0
                      ? {
                          borderTopLeftRadius: radiusValue,
                          borderTopRightRadius: radiusValue,
                        }
                      : {
                          borderBottomLeftRadius: radiusValue,
                          borderBottomRightRadius: radiusValue,
                        },
                  ]}
                />
                {this.state.isDownloading ? (
                  <View style={styles.bgImg} key={ind + 1000}>
                    <ActivityIndicator size={"large"} color={"#fff"} />
                  </View>
                ) : !img.isDownloaded &&
                  msgPosition === "left" &&
                  (msgType === 2 || msgType === 9) ? (
                  <TouchableOpacity
                    key={ind + 10000}
                    style={styles.bgImg}
                    onPress={this.donwloadImages}
                  >
                    <Icon
                      name={"arrow-circle-down"}
                      size={iconSize}
                      color={"#fff"}
                    />
                    <Text style={styles.downloadText}>Download</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            );
          })}
        </View>
      );
    } else if (this.state?.imagesArray.length == 3) {
      return (
        <View
          style={[
            msgType === 8
              ? styles.replyImageMessageFlex
              : styles.imageMessageFlex,
            { flexWrap: "wrap" },
          ]}
        >
          {this.state?.imagesArray.map((img, ind) => {
            return (
              <>
                <FastImage
                  key={ind}
                  source={{
                    uri: img.isDownloaded
                      ? img.uri
                      : appConfig.imagePath + img.uri,
                  }}
                  style={
                    ind == 2
                      ? [
                          styles.fastImageStyleThreeImgRight,
                          {
                            borderBottomRightRadius: radiusValue,
                            borderTopRightRadius: radiusValue,
                          },
                        ]
                      : [
                          styles.fastImageStyleThreeImgLeft,
                          ind == 0
                            ? {
                                borderTopLeftRadius: radiusValue,
                              }
                            : {
                                borderBottomLeftRadius: radiusValue,
                              },
                        ]
                  }
                />
                {this.state.isDownloading ? (
                  <View style={styles.bgImg} key={ind + 1000}>
                    <ActivityIndicator size={"large"} color={"#fff"} />
                  </View>
                ) : !img.isDownloaded &&
                  msgPosition === "left" &&
                  (msgType === 2 || msgType === 9) ? (
                  <TouchableOpacity
                    key={ind + 10000}
                    style={styles.bgImg}
                    onPress={this.donwloadImages}
                  >
                    <Icon
                      name={"arrow-circle-down"}
                      size={iconSize}
                      color={"#fff"}
                    />
                    <Text style={styles.downloadText}>Download</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            );
          })}
        </View>
      );
    } else if (this.state?.imagesArray.length == 4) {
      return (
        <View
          style={[
            msgType === 8
              ? styles.replyImageMessageFlex
              : styles.imageMessageFlex,
            { flexWrap: "wrap" },
          ]}
        >
          {this.state?.imagesArray.map((img, ind) => {
            return (
              <>
                <FastImage
                  key={ind}
                  source={{
                    uri: img.isDownloaded
                      ? img.uri
                      : appConfig.imagePath + img.uri,
                  }}
                  style={[
                    styles.fastImageStyleThreeImgLeft,
                    ind == 0
                      ? {
                          borderTopLeftRadius: radiusValue,
                        }
                      : ind == 1
                      ? {
                          borderBottomLeftRadius: radiusValue,
                        }
                      : ind == 2
                      ? {
                          borderTopRightRadius: radiusValue,
                        }
                      : {
                          borderBottomRightRadius: radiusValue,
                        },
                  ]}
                />
                {this.state.isDownloading ? (
                  <View style={styles.bgImg} key={ind + 1000}>
                    <ActivityIndicator size={"large"} color={"#fff"} />
                  </View>
                ) : !img.isDownloaded &&
                  msgPosition === "left" &&
                  (msgType === 2 || msgType === 9) ? (
                  <TouchableOpacity
                    key={ind + 10000}
                    style={styles.bgImg}
                    onPress={this.donwloadImages}
                  >
                    <Icon
                      name={"arrow-circle-down"}
                      size={iconSize}
                      color={"#fff"}
                    />
                    <Text style={styles.downloadText}>Download</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            );
          })}
        </View>
      );
    } else if (this.state?.imagesArray.length == 5) {
      return (
        <View
          style={[
            msgType === 8
              ? styles.replyImageMessageFlex
              : styles.imageMessageFlex,
            { flexWrap: "wrap" },
          ]}
        >
          {this.state?.imagesArray.map((img, ind) => {
            return (
              <>
                <FastImage
                  key={ind}
                  source={{
                    uri: img.isDownloaded
                      ? img.uri
                      : appConfig.imagePath + img.uri,
                  }}
                  style={
                    ind > 1
                      ? [
                          styles.fastImageStyleFiveImgRight,
                          ind === 2
                            ? {
                                borderTopRightRadius: radiusValue,
                              }
                            : ind === 4
                            ? {
                                borderBottomRightRadius: radiusValue,
                              }
                            : {},
                        ]
                      : [
                          styles.fastImageStyleThreeImgLeft,
                          ind == 0
                            ? {
                                borderTopLeftRadius: radiusValue,
                              }
                            : {
                                borderBottomLeftRadius: radiusValue,
                              },
                        ]
                  }
                />
                {this.state.isDownloading ? (
                  <View style={styles.bgImg} key={ind + 1000}>
                    <ActivityIndicator size={"large"} color={"#fff"} />
                  </View>
                ) : !img.isDownloaded &&
                  msgPosition === "left" &&
                  (msgType === 2 || msgType === 9) ? (
                  <TouchableOpacity
                    key={ind + 10000}
                    style={styles.bgImg}
                    onPress={this.donwloadImages}
                  >
                    <Icon
                      name={"arrow-circle-down"}
                      size={iconSize}
                      color={"#fff"}
                    />
                    <Text style={styles.downloadText}>Download</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            );
          })}
        </View>
      );
    } else {
      return (
        <View
          style={[
            msgType === 8
              ? styles.replyImageMessageFlex
              : styles.imageMessageFlex,
            { flexWrap: "wrap" },
          ]}
        >
          {this.state?.imagesArray.map((img, ind) => {
            return (
              <>
                {ind < 4 ? (
                  <FastImage
                    key={ind}
                    source={{
                      uri: img.isDownloaded
                        ? img.uri
                        : appConfig.imagePath + img.uri,
                    }}
                    style={
                      ind > 1
                        ? [
                            styles.fastImageStyleFiveImgRight,
                            ind === 2
                              ? {
                                  borderTopRightRadius: radiusValue,
                                }
                              : {},
                          ]
                        : [
                            styles.fastImageStyleThreeImgLeft,
                            ind == 0
                              ? {
                                  borderTopLeftRadius: radiusValue,
                                }
                              : {
                                  borderBottomLeftRadius: radiusValue,
                                },
                          ]
                    }
                  />
                ) : ind === 4 ? (
                  <ImageBackground
                    key={ind + 1000}
                    source={{
                      uri: img.isDownloaded
                        ? img.uri
                        : appConfig.imagePath + img.uri,
                    }}
                    style={[
                      styles.fastImageStyleFiveImgRight,
                      styles.imageBackgroundSixPlus,
                    ]}
                    imageStyle={{ borderBottomRightRadius: radiusValue }}
                  >
                    <Text style={styles.imageBackgroundSixPlusTextStyle}>
                      + {this.state?.imagesArray.length - 5}
                    </Text>
                  </ImageBackground>
                ) : null}
                {this.state.isDownloading ? (
                  <View style={styles.bgImg} key={ind + 2000}>
                    <ActivityIndicator size={"large"} color={"#fff"} />
                  </View>
                ) : !img.isDownloaded &&
                  msgPosition === "left" &&
                  (msgType === 2 || msgType === 9) ? (
                  <TouchableOpacity
                    key={ind + 10000}
                    style={styles.bgImg}
                    onPress={this.donwloadImages}
                  >
                    <Icon
                      name={"arrow-circle-down"}
                      size={iconSize}
                      color={"#fff"}
                    />
                    <Text style={styles.downloadText}>Download</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            );
          })}
        </View>
      );
    }
  }
}
