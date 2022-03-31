import React, {useState} from 'react';
import {Text, StyleSheet, Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const TextInANest = props => {
  const [msgHeight, setMsgHeight] = useState(0);
  const [msgWidth, setMsgWidth] = useState(0);
  return (
    <Text
      style={[
        props.style,
        {
          width:
            msgHeight > 21 && msgWidth > 200 ? windowWidth * 0.8 : undefined,
        },
      ]}
      onLayout={e => {
        const {height, width} = e.nativeEvent.layout;
        setMsgHeight(height);
        setMsgWidth(width);
      }}>
      {props.message}
    </Text>
  );
};

const styles = StyleSheet.create({});

export default TextInANest;
