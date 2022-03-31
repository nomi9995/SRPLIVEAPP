import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import {connect} from 'react-redux';
import StoryServices from '../../../services/StoryServices';
import moment from 'moment';
import appConfig from '../../../utils/appConfig';

class storyView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myStory: [],
      storyUpload: false,
      mediaUploadComponent: true,
    };
  }
  componentDidMount = () => {
    let token = this.props.user.token;

    StoryServices.storyList(token).then(res => {
      this.setState({myStory: res.data.data.my_stories.stories});
    });
  };

  imagePathSet = url => {
    let url2 = String(url);
    return url2.replace(/\\/g, '/');
  };
  render() {
    return (
      <>
        <SafeAreaView style={{backgroundColor: '#008069'}}></SafeAreaView>
        <>
          <View style={styles.headerView}>
            <TouchableOpacity
              style={{width: 30}}
              onPress={() => this.props.navigation.goBack()}>
              <FontAwesome5
                name="chevron-left"
                style={{
                  color: 'white',
                  fontSize: 20,
                  paddingLeft: 10,
                }}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>MyUpdates</Text>
            <FontAwesome5
              name="ellipsis-h"
              style={{
                color: 'white',
                fontSize: 20,
                paddingRight: 10,
              }}
            />
          </View>
          {this.state.storyUpload ? (
            <View style={{flex: 1, alignItems: 'center'}}>
              <ActivityIndicator color="green" size="small" />
            </View>
          ) : (
            <ScrollView>
              {this.state.myStory !== undefined ? (
                <View>
                  {this.state.myStory.map(data => {
                    return (
                      <View style={[styles.container]}>
                        <TouchableWithoutFeedback
                          onPress={() =>
                            this.props.navigation.navigate('StatusViewer', {
                              stories: [data],
                              myStories: 'Mystories',
                            })
                          }>
                          <View style={[styles.profileView]}>
                            {data?.content?.path === null ? (
                              <FastImage
                                style={styles.profileImage}
                                source={require('../../../assets/deafultimage.png')}
                              />
                            ) : data?.story_type === 1 ? (
                              <FastImage
                                style={styles.profileImage}
                                source={{
                                  uri:
                                    appConfig.LastStoryPath +
                                    this.imagePathSet(data.content.path),
                                }}
                              />
                            ) : (
                              <FastImage
                                style={styles.profileImage}
                                source={{
                                  uri: appConfig.avatarPath+this.props.user.user.avatar,
                                }}
                              />
                            )}
                          </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.infoView}>
                          <View style={styles.nameView}>
                            {data.reactions === null ? (
                              <Text style={styles.nameText}>no view</Text>
                            ) : (
                              <Text style={styles.nameText}>
                                {data.reactions.length} Views
                              </Text>
                            )}
                            <Text style={styles.timeText}>
                              {moment
                                .utc(data.created_on)
                                .local('tr')
                                .fromNow()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </ScrollView>
          )}

          <TouchableWithoutFeedback>
            <View style={styles.bottomButton}>
              <FontAwesome5
                name="camera"
                style={{
                  color: 'white',
                  fontSize: 20,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    theme: state.auth.theme,
    user: state.auth.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(storyView);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginHorizontal: 20,
  },
  profileView: {
    width: 50,
    height: 50,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 29,
  },
  infoView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  nameView: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
  },
  timeText: {
    marginTop: 4,
    fontSize: 12,
  },
  headerView: {
    backgroundColor: '#008069',
    flexDirection: 'row',
    paddingVertical: '5%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    color: 'white',
    fontSize: 15,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 35,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008069',
  },
});
