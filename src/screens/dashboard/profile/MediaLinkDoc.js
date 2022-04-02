import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
  BackHandler,
  SafeAreaView,
  Dimensions,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import FastImage from "react-native-fast-image";
import appConfig from "../../../utils/appConfig";
// import ScrollableTabView from 'react-native-scrollable-tab-view';
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome";
import { SliderBox } from "react-native-image-slider-box";
import { onDownload } from "../../../utils/regex";
import FileViewer from "react-native-file-viewer";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

const BASE_URL = appConfig.imagePath;
const LOCAL_URL = appConfig.localPath;

const { width, height } = Dimensions.get("window");

class MediaLinkDoc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageView: false,
      firstItem: 0,
      imagesArray: [],
      filesArray: [],
      index: 0,
      routes: [
        { key: "first", title: "MEDIA" },
        { key: "second", title: "DOCS" },
        { key: "third", title: "LINKS" },
      ],
    };
  }

  componentDidMount = () => {
    this.setImagesInState();
    this.setFilesInState();
    BackHandler.addEventListener("hardwareBackPress", this.hardwareBack);
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener("hardwareBackPress", this.hardwareBack);
  };

  hardwareBack = () => {
    this.props.navigation.goBack();
    return true;
  };

  setImagesInState = () => {
    const sharedPhotos = this.props?.route?.params?.item?.shared_photos;
    if (sharedPhotos !== undefined && sharedPhotos !== null) {
      sharedPhotos.map((res) => {
        if (JSON.parse(res.message)?.content !== undefined) {
          JSON.parse(res.message).content.map((data) => {
            if (typeof data === "string") {
              this.chekcMedia(data);
            } else {
              this.chekcMedia(data.name);
            }
          });
        }
      });
    }
  };

  setFilesInState = () => {
    const sharedFiles = this.props?.route?.params?.item?.shared_files;
    if (sharedFiles !== undefined && sharedFiles !== null) {
      sharedFiles.map((res) => {
        if (JSON.parse(res.message)?.content !== undefined) {
          JSON.parse(res.message).content.map((data) => {
            if (typeof data === "string") {
              let imgs = [];
              onDownload
                .checkExistingMedia(data, "Files/Sent")
                .then((resSent) => {
                  if (resSent) {
                    let file = Object.assign(
                      { name: data },
                      { isDownloaded: true },
                      { isSent: true }
                    );
                    imgs.push(file);
                    this.setState({
                      filesArray: [...this.state.filesArray, ...imgs],
                    });
                  } else {
                    onDownload
                      .checkExistingMedia(data.name, "Files")
                      .then((resReceived) => {
                        if (resReceived) {
                          let file = Object.assign(
                            { name: data },
                            { isDownloaded: true },
                            { isSent: true }
                          );
                          imgs.push(file);
                          this.setState({
                            filesArray: [...this.state.filesArray, ...imgs],
                          });
                        } else {
                          let file = Object.assign(
                            { name: data },
                            { isDownloaded: true },
                            { isSent: true }
                          );
                          imgs.push(file);
                          this.setState({
                            filesArray: [...this.state.filesArray, ...imgs],
                          });
                        }
                      })
                      .catch((err) => {
                        console.log("CheckExistingMediaReceivedError: ", err);
                      });
                  }
                })
                .catch((err) => {
                  console.log("CheckExistingMediaSentError: ", err);
                });
            } else {
              let imgs = [];
              onDownload
                .checkExistingMedia(data.name, "Files/Sent")
                .then((resSent) => {
                  if (resSent) {
                    let file = Object.assign(
                      data,
                      { isDownloaded: true },
                      { isSent: true }
                    );
                    imgs.push(file);
                    this.setState({
                      filesArray: [...this.state.filesArray, ...imgs],
                    });
                  } else {
                    onDownload
                      .checkExistingMedia(data.name, "Files")
                      .then((resReceived) => {
                        if (resReceived) {
                          let file = Object.assign(
                            data,
                            { isDownloaded: true },
                            { isSent: false }
                          );
                          imgs.push(file);
                          this.setState({
                            filesArray: [...this.state.filesArray, ...imgs],
                          });
                        } else {
                          let file = Object.assign(
                            data,
                            { isDownloaded: false },
                            { isSent: false }
                          );
                          imgs.push(file);
                          this.setState({
                            filesArray: [...this.state.filesArray, ...imgs],
                          });
                        }
                      })
                      .catch((err) => {
                        console.log("CheckExistingMediaReceivedError: ", err);
                      });
                  }
                })
                .catch((err) => {
                  console.log("CheckExistingMediaSentError: ", err);
                });
            }
          });
        }
      });
    }
  };

  chekcMedia = (data) => {
    let imgs = [];
    onDownload
      .checkExistingMedia(data, "Images/Sent")
      .then((resSent) => {
        if (resSent) {
          imgs.push("file://" + LOCAL_URL + "Images/Sent/" + data);
          this.setState({ imagesArray: [...this.state.imagesArray, ...imgs] });
        } else {
          onDownload
            .checkExistingMedia(data, "Images")
            .then((resReceived) => {
              if (resReceived) {
                imgs.push("file://" + LOCAL_URL + "Images/" + data);
                this.setState({
                  imagesArray: [...this.state.imagesArray, ...imgs],
                });
              } else {
                imgs.push(appConfig.imagePath + data);
                this.setState({
                  imagesArray: [...this.state.imagesArray, ...imgs],
                });
              }
            })
            .catch((err) => {
              console.log("CheckExistingMediaReceivedError: ", err);
            });
        }
      })
      .catch((err) => {
        console.log("CheckExistingMediaSentError: ", err);
      });
  };

  openFile = (data) => {
    if (data.isDownloaded && !data.isSent) {
      let url = LOCAL_URL + "Files/" + data.name;
      this.openOptions(url);
    } else if (data.isDownloaded && data.isSent) {
      let url = LOCAL_URL + "Files/Sent/" + data.name;
      this.openOptions(url);
    } else {
      let url = appConfig.filePath + data.name;
      Linking.openURL(url);
    }
  };

  openOptions = async (url) => {
    try {
      await FileViewer.open(url, {
        showOpenWithDialog: true,
        showAppsSuggestions: true,
      });
    } catch (e) {
      console.log("An error occurred", e);
    }
  };

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await this.setState({
            imageView: true,
            firstItem: index,
          });
        }}
      >
        <FastImage style={styles.mediaImages} source={{ uri: item }} />
      </TouchableOpacity>
    );
  };

  FirstRoute = () => {
    const { imagesArray } = this.state;
    return (
      <FlatList
        data={imagesArray}
        keyExtractor={(item, index) => index}
        renderItem={this.renderItem}
        numColumns={4}
      />
      // <ScrollView>
      //   <View style={styles.imageFlexWrap}>
      //     <>
      //       {imagesArray.map((img, ind) => {
      //         return (
      //           <TouchableOpacity
      //             onPress={async () => {
      //               await this.setState({
      //                 imageView: true,
      //                 firstItem: ind,
      //               });
      //             }}>
      //             <FastImage style={styles.mediaImages} source={{uri: img}} />
      //           </TouchableOpacity>
      //         );
      //       })}
      //     </>
      //   </View>
      // </ScrollView>
    );
  };

  SecondRoute = () => {
    const { filesArray } = this.state;
    return (
      <ScrollView>
        {filesArray.map((data, ind) => {
          return (
            <TouchableOpacity
              key={ind}
              style={styles.fileCard1}
              onPress={() => this.openFile(data)}
            >
              <View style={styles.iconView}>
                {data.extenstion == "pdf" ? (
                  <FontAwesome5 name="file-pdf" style={styles.IconStyle} />
                ) : data.extenstion == "docx" ? (
                  <FontAwesome5 name="file-word" style={styles.IconStyle} />
                ) : (
                  <FontAwesome5 name="file-alt" style={styles.IconStyle} />
                )}

                <View style={styles.docView}>
                  <Text style={{ color: "black" }}>{data.name}</Text>
                  <Text style={styles.docSize}>
                    {data.size}.{data.extenstion}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  ThirdRoute = () => {
    const { shared_links } = this.props?.route?.params?.item;
    return (
      <ScrollView>
        {shared_links !== 0 &&
          shared_links?.map((res, ind) => {
            return (
              <TouchableOpacity
                key={ind}
                style={styles.fileCard1}
                onPress={() => Linking.openURL(JSON.parse(res.message).url)}
              >
                <View style={styles.linkView}>
                  <View style={styles.link}>
                    <View style={styles.linkInnerView}>
                      <FontAwesome name="link" style={styles.linkIcon} />
                    </View>
                    <View style={styles.linkMessage}>
                      <Text></Text>
                      <Text numberOfLines={1}>
                        {JSON.parse(res.message).url}
                      </Text>
                      <Text style={styles.linkTitle}>
                        {JSON.parse(res.message).title}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    );
  };

  renderScene = SceneMap({
    first: this.FirstRoute,
    second: this.SecondRoute,
    third: this.ThirdRoute,
  });

  renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "white" }}
      style={{ backgroundColor: "#008069" }}
    />
  );

  render() {
    const { index, routes, imagesArray } = this.state;
    return this.state.imageView ? (
      <SafeAreaView style={{ backgroundColor: "#000" }}>
        <View style={{ backgroundColor: "#000" }}>
          <TouchableOpacity
            onPress={() => this.setState({ imageView: false })}
            style={styles.crossIconPosition}
          >
            <FontAwesome name={"times-circle"} size={40} color="white" />
          </TouchableOpacity>
          <SliderBox
            firstItem={this.state.firstItem}
            sliderBoxHeight={"100%"}
            resizeMode="contain"
            images={imagesArray}
          />
        </View>
      </SafeAreaView>
    ) : (
      <View style={styles.container}>
        <SafeAreaView style={{ backgroundColor: "#008069" }}>
          <View style={styles.headerview}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.navigation.goBack()}
            >
              <FontAwesome5 name={"arrow-left"} size={20} color={"white"} />
            </TouchableOpacity>
            <Text style={styles.settingText}> Media </Text>
          </View>
        </SafeAreaView>
        <TabView
          navigationState={{ index, routes }}
          renderTabBar={this.renderTabBar}
          renderScene={this.renderScene}
          onIndexChange={(data) => {
            this.setState({ index: data });
          }}
          initialLayout={{ width: Dimensions.get("window").width }}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    theme: state.auth.theme,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaLinkDoc);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  fileCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: "5%",
    marginVertical: "2%",
    padding: "2%",
    borderRadius: 5,
    elevation: 5,
  },
  tabView: {
    flex: 1,
    paddingBottom: "5%",
    backgroundColor: "white",
  },
  imageFlexWrap: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mediaImages: {
    width: width * 0.2178,
    height: height * 0.1,
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 10,
  },
  tabBarTextStyle: {
    fontSize: 15,
    fontFamily: "Roboto-Regular",
  },
  tabView1: {
    flex: 1,
    paddingBottom: "5%",
    backgroundColor: "#EEEEEE",
  },
  fileCard1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    marginVertical: "1%",
    padding: "2%",
    backgroundColor: "white",
  },
  link: {
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    alignItems: "center",
  },
  headerview: {
    backgroundColor: "#008069",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 10,
  },
  settingText: {
    color: "white",
    fontSize: 18,
    marginLeft: 5,
    fontFamily: "Roboto-Regular",
  },
  iconView: {
    flexDirection: "row",
    alignItems: "center",
  },
  IconStyle: {
    color: "#06A88E",
    fontSize: 25,
    padding: "3%",
  },
  docView: {
    marginLeft: "5%",
    maxWidth: 300,
  },
  docSize: {
    color: "grey",
    fontSize: 12,
  },
  linkView: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkInnerView: {
    padding: "7%",
    backgroundColor: "#CFD8DD",
  },
  linkIcon: {
    color: "white",
    fontSize: 22,
  },
  linkMessage: {
    width: "80%",
    justifyContent: "space-between",
    paddingLeft: 5,
  },
  linkTitle: {
    marginTop: 10,
    fontSize: 10,
    color: "grey",
  },

  crossIconPosition: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
});
