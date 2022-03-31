import React, {useState} from 'react';
import {Text, TextInput, View, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const PizzaTranslator = props => {
  const [calcImgHeight, setcalcImgHeight] = useState(0);
  return (
    <View>
      {/* <Text style={{padding: 10, fontSize: 42}}>dsddd</Text> */}
      <FastImage
        source={{
          uri: props.uri,
        }}
        style={{
          width: windowWidth * 0.7,
          height: calcImgHeight,
          borderRadius: 10,
        }}
        onLoad={evt =>
          setcalcImgHeight(
            (evt.nativeEvent.height / evt.nativeEvent.width) *
              windowWidth *
              0.6,
          )
        }
        resizeMode={'stretch'}
      />
    </View>
  );
};

export default PizzaTranslator;
