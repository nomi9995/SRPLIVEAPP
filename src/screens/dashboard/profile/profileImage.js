import React, { Component } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
  Image,
  Dimensions,
} from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import Video from "react-native-video";
import ImageZoom from "react-native-image-pan-zoom";

const { WindowWidth, WindoeHeight } = Dimensions.get("window");
//redux
import { connect } from "react-redux";

class MessagePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      opacity: 0,
    };
  }

  componentDidMount = () => {
    this.state.images.push({ url: this.props.route.params.url });
    this.setState({ images: this.state.images });
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
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={styles.crossIconPosition}
          >
            <FontAwesome name={"times-circle"} size={32} color="white" />
          </TouchableOpacity>
          <ImageZoom
            cropWidth={Dimensions.get("window").width}
            cropHeight={Dimensions.get("window").height}
            imageWidth={"30%"}
            imageHeight={400}
          >
            <Image
              style={{ width: 400, height: 400 }}
              source={{ uri: this.props.route.params.url }}
            />
          </ImageZoom>
        </View>
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
