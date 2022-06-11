import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from "react-native";
import Video from "react-native-video-controls";
import FastImage from "react-native-fast-image";
import GestureRecognizer from "react-native-swipe-gestures";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

class statusViewerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 1,
      progressStatus: 0,
      progessIndex: 0,
      activeBar: [],
      stories: [],
      prevState: 0,
      loader: true,
      onAnimateCount: 1,
      onPressAnimate: false,
      width: new Animated.Value(0),
      pressInState: 0,
    };
  }
  componentDidMount() {
    console.log("this.props.route.params", this.props.route.params);
    if (this.props.route.params.stories) {
      this.props.route.params?.stories?.stories.map((res, key) => {
        this.state.stories.push({
          id: key + 1,
          url: `https://www.srplivehelp.com/media/drive/${res.content.path}`,
          type: res.story_type,
          duration: res.content.duration,
        });
      });
    }
    if (this.state.activeIndex === 1) {
      this.setState({ stories: this.state.stories });
    }
  }

  onAnimate = (check = false, duration = 2000) => {
    if (!this.state.loader || check) {
      this.state.activeBar.push(this.state.activeIndex - 1);
      Animated.timing(this.state.width, {
        toValue: (WIDTH - 18) / this.state.stories.length,
        duration: duration,
        useNativeDriver: false,
      }).start((response) => {
        if (response.finished) {
          if (this.state.activeIndex !== this.state.stories.length) {
            this.setState({ activeIndex: this.state.activeIndex + 1 });
            this.state.width.setValue(0);
            this.onAnimate();
          } else {
            this.props.navigation.goBack();
          }
        }
      });
    }
  };
  imagePathSet = (url) => {
    let url2 = String(url);
    return url2.replace(/\\/g, "/");
  };

  onLoadVideo = (duration) => {
    this.setState({ loader: false });
    this.onAnimate(true, duration * 1000);
  };
  onSwipeDown = () => {
    this.props.navigation.goBack();
  };

  render() {
    console.log("stories", this.state.stories);
    const config = {
      velocityThreshold: 0.2,
      directionalOffsetThreshold: 80,
    };
    let presIn = 0;
    return (
      <GestureRecognizer config={config} onSwipeDown={this.onSwipeDown}>
        <View style={{ backgroundColor: "black", height: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              zIndex: 1,
              paddingHorizontal: "2%",
            }}
          >
            {this.state.stories.map((data, key) => {
              let activeBar = 0;
              this.state.activeBar.forEach((element) => {
                activeBar = element;
              });

              return (
                <>
                  <View
                    style={[
                      styles.container,
                      { width: 100 / this.state.stories.length + "%" },
                    ]}
                  >
                    <Animated.View
                      style={[
                        styles.inner,
                        this.state.activeIndex === data.id
                          ? { width: this.state.width }
                          : this.state.activeIndex > data.id
                          ? { width: "100%" }
                          : { width: "0%" },
                      ]}
                    />
                  </View>
                </>
              );
            })}
          </View>
          {this.state.loader ? (
            <View
              style={{
                position: "absolute",
                zIndex: 2,
                top: HEIGHT / 2 - 18,
                left: WIDTH / 2 - 18,
              }}
            >
              <ActivityIndicator
                style={{ flex: 1 }}
                size="large"
                color="grey"
              />
            </View>
          ) : null}
          {this.state?.stories.map((res, key) => {
            console.log("res", res);
            console.log("res url", res.url.replace(/ /g, "%20"));
            return (
              <View style={{ backgroundColor: "black" }}>
                {res.type === 1
                  ? this.state.activeIndex === res.id && (
                      <>
                        <FastImage
                          onProgress={() => this.setState({ loader: true })}
                          onLoadEnd={() => this.setState({ loader: false })}
                          onLoad={(res) => {
                            this.onAnimate(true);
                          }}
                          key={key}
                          source={{ uri: this.imagePathSet(res.url) }}
                          resizeMode="contain"
                        >
                          <View
                            style={{
                              flexDirection: "column",
                              flexWrap: "wrap",
                            }}
                          >
                            <View
                              style={{
                                width: "50%",
                                height: "100%",
                              }}
                            >
                              <TouchableOpacity
                                style={{
                                  flex: 1,
                                }}
                                onPressIn={() => {
                                  this.state.width.stopAnimation(
                                    ({ value }) => {}
                                  );
                                }}
                                onPressOut={() => {
                                  this.onAnimate();
                                }}
                                onPress={() => {
                                  if (this.state.activeIndex !== 1) {
                                    this.setState({
                                      activeIndex: this.state.activeIndex - 1,
                                      loader: false,
                                    });
                                    this.state.width.setValue(0);
                                    this.onAnimate();
                                  } else if (
                                    this.state.activeIndex ===
                                    this.state.stories.length
                                  ) {
                                    null;
                                  }
                                }}
                              >
                                <Text
                                  style={{
                                    color: "red",
                                    fontSize: 22,
                                  }}
                                ></Text>
                              </TouchableOpacity>
                            </View>
                            <View style={{ width: "50%", height: "100%" }}>
                              <Pressable
                                style={{
                                  flex: 1,
                                }}
                                onLongPress={() => {
                                  {
                                    this.state.width.stopAnimation(
                                      ({ value }) => {}
                                    );
                                    presIn = 1;
                                  }
                                }}
                                onPressOut={() => {
                                  {
                                    presIn = 2;
                                    this.onAnimate();
                                  }
                                }}
                                onPress={() => {
                                  if (
                                    this.state.activeIndex <
                                    this.state.stories.length
                                  ) {
                                    this.setState({
                                      activeIndex: this.state.activeIndex + 1,
                                      loader: false,
                                    });
                                    this.state.width.setValue(0);
                                    this.onAnimate();
                                  } else if (
                                    this.state.activeIndex ==
                                    this.state.stories.length
                                  ) {
                                    this.props.navigation.goBack();
                                  }
                                  presIn = 0;
                                }}
                              >
                                <Text
                                  style={{
                                    color: "red",
                                    fontSize: 22,
                                  }}
                                ></Text>
                              </Pressable>
                            </View>
                          </View>
                        </FastImage>
                      </>
                    )
                  : this.state.activeIndex === res.id && (
                      <View
                        style={{
                          backgroundColor: "#000",
                        }}
                      >
                        <Video
                          disableFullscreen
                          disablePlayPause
                          disableSeekbar
                          disableVolume
                          disableTimer
                          disableBack
                          onLoad={(res) => this.onLoadVideo(res.duration)}
                          onBuffer={({ isBuffering }) => {
                            if (isBuffering == true) {
                              this.setState({ loader: isBuffering });
                              this.state.width.stopAnimation(({ value }) => {});
                            } else {
                              this.setState({ loader: isBuffering });
                            }
                          }}
                          source={{
                            uri: res.url.replace(/ /g, "%20"),
                            type: "mp4",
                          }}
                          resizeMode="contain"
                          paused={false}
                          style={{
                            position: "absolute",
                            zIndex: -1,
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                          }}
                          ignoreSilentSwitch={"ignore"}
                        />
                        <View
                          style={{ flexDirection: "column", flexWrap: "wrap" }}
                        >
                          <View
                            style={{
                              width: "50%",
                              height: "100%",
                            }}
                          >
                            <TouchableOpacity
                              style={{ height: "100%" }}
                              onPressIn={() => {
                                this.state.width.stopAnimation(
                                  ({ value }) => {}
                                );
                              }}
                              onPressOut={() => {
                                this.onAnimate();
                              }}
                              onPress={() => {
                                if (this.state.activeIndex !== 1) {
                                  this.setState({
                                    activeIndex: this.state.activeIndex - 1,
                                    loader: false,
                                  });
                                  this.state.width.setValue(0);
                                  this.onAnimate();
                                } else if (
                                  this.state.activeIndex ===
                                  this.state.stories.length
                                ) {
                                  null;
                                }
                              }}
                            >
                              <Text
                                style={{
                                  color: "red",
                                  fontSize: 22,
                                }}
                              ></Text>
                            </TouchableOpacity>
                          </View>
                          <View
                            style={{
                              width: "50%",
                              height: "100%",
                            }}
                          >
                            <Pressable
                              style={{ height: "100%" }}
                              onLongPress={() => {
                                console.log("Pressable onLongPress");
                                {
                                  this.state.width.stopAnimation(
                                    ({ value }) => {}
                                  );
                                  presIn = 1;
                                }
                              }}
                              onPressOut={() => {
                                console.log("Pressable onPressOut");
                                {
                                  presIn = 2;
                                  this.onAnimate();
                                }
                              }}
                              onPress={() => {
                                console.log("Pressable onPress");
                                if (
                                  this.state.activeIndex <
                                  this.state.stories.length
                                ) {
                                  this.setState({
                                    activeIndex: this.state.activeIndex + 1,
                                    loader: false,
                                  });
                                  this.state.width.setValue(0);
                                  this.onAnimate();
                                } else if (
                                  this.state.activeIndex ==
                                  this.state.stories.length
                                ) {
                                  this.props.navigation.goBack();
                                }
                                presIn = 0;
                              }}
                            >
                              <Text
                                style={{
                                  color: "red",
                                  fontSize: 22,
                                }}
                              ></Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    )}
              </View>
            );
          })}
        </View>
      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 4,
    borderColor: "#666666",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: "8%",
    justifyContent: "center",
  },
  inner: {
    width: "0%",
    height: 3,
    borderRadius: 15,
    backgroundColor: "white",
  },
  label: {
    fontSize: 23,
    color: "black",
    position: "absolute",
    zIndex: 1,
    alignSelf: "center",
  },
});

export default statusViewerScreen;
