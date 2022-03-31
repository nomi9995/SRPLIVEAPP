import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
class Stickers extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      stickerType: 'Mugsy',
    };
  }

  render() {
    let stickerTitle =
      this.props.stickers !== null ? Object.keys(this.props.stickers) : null;
    return (
      <View style={styles.paperclipOption}>
        <View>
          <ScrollView horizontal={true} style={{padding: 10, marginRight: 20}}>
            {stickerTitle.map((title, key) => {
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => this.setState({stickerType: title})}
                  style={{
                    borderRadius: 5,
                    height: 30,
                    backgroundColor: 'green',
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 10,
                    marginVertical: 10,
                  }}>
                  <Text style={{color: 'white'}}>{title}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <ScrollView style={{height: '55%'}}>
            <View
              style={{
                flex: 1,
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 10,
              }}>
              {this.props.stickers[this.state.stickerType] !== undefined &&
                this.props.stickers[this.state.stickerType].map(
                  (imageName, key) => {
                    return (
                      <TouchableOpacity
                        key={key}
                        onPress={() => this.props.selectedSticker(imageName)}>
                        <FastImage
                          source={{
                            uri: `https://www.srplivehelp.com/media/stickers/${imageName}`,
                          }}
                          style={{height: 50, width: 50, marginVertical: 5}}
                        />
                      </TouchableOpacity>
                    );
                  },
                )}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  paperclipOption: {
    backgroundColor: 'white',
    height: 200,
    marginHorizontal: '2%',
    borderRadius: 10,
  },
  paperclipFlex: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  mediaIcons: {
    height: 60,
    width: 60,
    marginHorizontal: '5%',
    marginVertical: '5%',
  },
});

export default Stickers;
