import React, { useEffect } from "react";
import { StyleSheet, Button, Text, View, Dimensions } from "react-native";
import FastImage from "react-native-fast-image";
import PdfThumbnail from "react-native-pdf-thumbnail";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const PdfThumail = (props) => {
  const [thumbnail, setThumbnail] = React.useState("");
  const [error, setError] = React.useState("");
  useEffect(() => {
    // console.log(props.data);
    thumbnailgenator(props.data.name);
  }, [props.data.name]);
  const thumbnailgenator = async (uri) => {
    try {
      const result = await PdfThumbnail.generate("file://" + uri, 0);
      setThumbnail(result);
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <FastImage source={thumbnail} style={styles.thumbnailImage} />
    </View>
  );
};

export default PdfThumail;

const styles = StyleSheet.create({
  container: {
    maxHeight: windowHeight * 0.1,
    overflow: "hidden",
    marginBottom: 3,
  },
  thumbnailImage: {
    width: windowWidth * 0.6,
    height: windowHeight * 0.4,
  },
});
