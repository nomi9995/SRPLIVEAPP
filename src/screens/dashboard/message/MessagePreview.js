import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import Video from "react-native-video";
import ImageViewer from "react-native-image-zoom-viewer";

//redux
import { connect } from "react-redux";

class MessagePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 0,
    };
  }

  componentDidMount = () => {
    BackHandler.addEventListener("hardwareBackPress", this.hardwareBack);
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener("hardwareBackPress", this.hardwareBack);
  };

  hardwareBack = () => {
    this.props.navigation.goBack();
    return true;
  };
  onLoadStart = () => {
    this.setState({ opacity: 1 });
  };

  onLoad = () => {
    this.setState({ opacity: 0 });
  };

  onBuffer = ({ isBuffering }) => {
    this.setState({ opacity: isBuffering ? 1 : 0 });
  };

  render() {
    return (
      <>
        <SafeAreaView style={{ backgroundColor: "#000" }}></SafeAreaView>
        {this.props?.route.params.messageType === "Video" ? (
          <View style={styles.videoWrapper}>
            <Video
              source={{
                uri: this.props?.route.params.videoPath.replace(/ /g, "%20"),
              }}
              resizeMode="contain"
              paused={false}
              controls={true}
              repeat={true}
              style={{ height: "100%", width: "100%" }}
              onBuffer={this.onBuffer}
              onLoadStart={this.onLoadStart}
              onLoad={this.onLoad}
            />
            <View style={styles.activityIndicator}>
              <ActivityIndicator
                animating
                size="large"
                color={"green"}
                style={{ opacity: this.state.opacity }}
              />
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.crossIconPosition}
            >
              <FontAwesome name={"times-circle"} size={32} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.crossIconPosition}
            >
              <FontAwesome name={"times-circle"} size={32} color="white" />
            </TouchableOpacity>
            <ImageViewer
              // sliderBoxHeight={'100%'}
              // resizeMode="contain"
              // images={this.props?.route.params.sliderState}
              imageUrls={this.props?.route.params.sliderState?.map((url) => ({
                url,
              }))}
              index={0}
              // menus={null}
              // style={{ width: "100%", height: "100%", flex: 1 }}
              // onLongPress={() => alert('longpress!')}
              // imageWidth={200}
              // imageHeight={200}
            />
          </View>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(MessagePreview);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  crossIconPosition: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  videoWrapper: {
    flex: 1,
    backgroundColor: "#000",
  },
  activityIndicator: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
