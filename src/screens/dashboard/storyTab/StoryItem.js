import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

class StoryItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {item} = this.props;
    
    return (
      <>
        <TouchableWithoutFeedback
          onPress={() =>
            this.props.navProps.navigation.navigate('StatusViewer', {
              stories: item,
            })
          }
          >
          <View style={styles.container}>
            <View>
              <View style={styles.profileView}>
                {item.avatar_url !== '' ? (
                  <FastImage
                    style={styles.profileImage}
                    source={{uri: item.avatar_url}}
                  />
                ) : (
                  <FastImage
                    style={styles.profileImage}
                    source={require('../../../assets/deafultimage.png')}
                  />
                )}
                <View style={styles.unreadCountView}>
                  <Text style={styles.unreadCountText}>{item.story_count}</Text>
                </View>
              </View>
            </View>
            <View style={styles.infoView}>
              <View style={styles.nameView}>
                <Text style={styles.nameText}>
                  {item?.first_name + ' ' + item?.last_name}
                </Text>
                <Text style={styles.timeText}>
                  {moment.utc(item?.last_story_at).local('tr').fromNow()}
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </>
    );
  }
}

export default StoryItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '2%',
    backgroundColor: '#FAFAFA',
    height: '25%',
  },
  profileView: {
    width: 50,
    height: 50,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 29,
  },
  unreadCountView: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'green',
    borderColor: 'white',
  },
  unreadCountText: {
    fontSize: 12,
    color: 'white',
  },
  infoView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    height: 70,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
  nameView: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Roboto-Regular',
  },
  timeText: {
    marginTop: 4,
    fontSize: 12,
    color: 'black',
    fontFamily: 'Roboto-Regular',
  },
});
