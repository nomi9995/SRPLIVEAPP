import React, { useState } from "react";
import { Text, TextInput, View, Dimensions } from "react-native";
import FastImage from "react-native-fast-image";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const PizzaTranslator = (props) => {
  const [calcImgHeight, setcalcImgHeight] = useState(0);
  const ImageCalculateHeight = (img) => {
    try {
      let heightWidth = img.slice(
        img.lastIndexOf("_") + 1,
        img.lastIndexOf(".")
      );
      // console.log('img', heightWidth.slice(0, heightWidth.indexOf('x')));
      let data = parseInt(
        heightWidth.slice(heightWidth.indexOf("x") + 1, heightWidth.length)
      );
      return data == "NaN" ? 100 : data;
    } catch (e) {
      console.log("error", img, e);
      return 20;
    }
  };
  const ImageCalculateWidth = (img) => {
    try {
      let heightWidth = img.slice(
        img.lastIndexOf("_") + 1,
        img.lastIndexOf(".")
      );
      let data = parseInt(heightWidth.slice(0, heightWidth.indexOf("x")));

      return data == "NaN" ? 100 : data;
    } catch (e) {
      console.log("error", img, e);
      return 20;
    }
  };
  return (
    <View>
      {/* <Text style={{padding: 10, fontSize: 42}}>dsddd</Text> */}
      <FastImage
        source={{
          uri: props.uri,
        }}
        style={{
          width: windowWidth * 0.65,
          height:
            (ImageCalculateHeight(props.uri.replace(/ /g, "%20")) /
              ImageCalculateWidth(props.uri.replace(/ /g, "%20"))) *
            windowWidth *
            0.7,
          borderRadius: 10,
        }}
        onLoad={(evt) =>
          setcalcImgHeight(
            (evt.nativeEvent.height / evt.nativeEvent.width) * windowWidth * 0.6
          )
        }
        resizeMode={"stretch"}
      />
    </View>
  );
};

export default PizzaTranslator;
