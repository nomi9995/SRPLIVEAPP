import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FastImage from "react-native-fast-image";

//Redux
import {
  setMediaOptionsOpen,
  setSickerOpen,
  setMediaType,
} from "../store/actions";
import { connect } from "react-redux";

class MediaOptions extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleMediaType = (type) => {
    this.props.onSetMediaType(type);
    this.props.onSetMediaOptionsOpen(false);
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={() => this.props.onSetMediaOptionsOpen(false)}
      >
        <View style={styles.mainWrapper}>
          <TouchableOpacity
            onPress={() => {
              this.handleMediaType("document");
            }}
            style={styles.camerAndgallery}
          >
            <FastImage
              source={require("../assets/file.png")}
              style={styles.mediaIcons}
            />
            <Text style={styles.categoryText}>Documnet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.handleMediaType("camera")}
            style={styles.camerAndgallery}
          >
            <FastImage
              source={require("../assets/camera.png")}
              style={styles.mediaIcons}
            />
            <Text style={styles.categoryText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.handleMediaType("gallery")}
            style={styles.camerAndgallery}
          >
            <FastImage
              source={require("../assets/gallery.png")}
              style={styles.mediaIcons}
            />
            <Text style={styles.categoryText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.camerAndgallery}
            onPress={() => {
              this.handleMediaType("VideoRecoder");
            }}
          >
            <FastImage
              source={require("../assets/video.png")}
              style={styles.mediaIcons}
            />
            <Text style={styles.categoryText}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.onSetMediaOptionsOpen(false);
              this.props.onSetSickerOpen(!this.props.stickerOpen);
            }}
            style={styles.camerAndgallery}
          >
            <FastImage
              source={require("../assets/sticker.png")}
              style={styles.mediaIcons}
            />
            <Text style={styles.categoryText}>Stickers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.camerAndgallery}
            onPress={() => this.handleMediaType("gif")}
          >
            <FastImage
              source={require("../assets/gif.png")}
              style={styles.mediaIcons}
            />
            <Text style={styles.categoryText}>GIF</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: "#fff",
  },
  mainWrapper: {
    marginTop: 10,
    borderRadius: 12,
    flexWrap: "wrap",
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: "10%",
    justifyContent: "space-between",
  },
  mediaIcons: {
    width: 50,
    height: 50,
    marginHorizontal: "7.5%",
  },
  camerAndgallery: {
    alignItems: "center",
    marginVertical: 10,
  },
  categoryText: {
    fontSize: 13,
    marginTop: 5,
    color: "grey",
  },
});

const mapStateToProps = (state) => {
  return {
    mediaOptionsOpen: state.stateHandler.mediaOptionsOpen,
    stickerOpen: state.stateHandler.stickerOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetMediaOptionsOpen: (data) => {
      dispatch(setMediaOptionsOpen(data));
    },
    onSetSickerOpen: (data) => {
      dispatch(setSickerOpen(data));
    },
    onSetMediaType: (data) => {
      dispatch(setMediaType(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaOptions);
