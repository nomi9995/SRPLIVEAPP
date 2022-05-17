import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";
import fileType from "../utils/mimetype";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome";
import Feather from "react-native-vector-icons/dist/Feather";
import Entypo from "react-native-vector-icons/dist/Entypo";
import AntDesign from "react-native-vector-icons/dist/AntDesign";
class FileTypeIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titleText: "Bird's Nest",
    };
  }

  render() {
    const data = this.props?.data?.extension;
    // console.log("extention data", this.props.data);
    let extention = undefined;
    if (data) {
      extention = fileType[data];
    } else {
      extention = "";
    }
    // console.log("extention", extention);
    return (
      <>
        {extention.includes("image") ? (
          <FontAwesome5
            name={"image"}
            style={{
              color: "grey",
              fontSize: 25,
            }}
          />
        ) : extention.includes("pdf") ? (
          <AntDesign
            name={"pdffile1"}
            style={{
              color: "red",
              fontSize: 25,
            }}
          />
        ) : extention.includes("msword") ? (
          <FontAwesome5
            name={"file-word-o"}
            style={{
              color: "blue",
              fontSize: 25,
            }}
          />
        ) : extention.includes("video") ? (
          <Entypo
            name={"video"}
            style={{
              color: "red",
              fontSize: 25,
            }}
          />
        ) : extention.includes("sheet") ? (
          <FontAwesome5
            name={"file-excel-o"}
            style={{
              color: "green",
              fontSize: 25,
            }}
          />
        ) : extention.includes("presentation") ? (
          <AntDesign
            name={"pptfile1"}
            style={{
              color: "#ffd400",
              fontSize: 25,
            }}
          />
        ) : (
          <AntDesign
            name={"file1"}
            style={{
              color: "#5959b5",
              fontSize: 25,
            }}
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: "Cochin",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default FileTypeIcon;
