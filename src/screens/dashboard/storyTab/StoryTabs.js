import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import StoryServices from '../../../services/StoryServices';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import moment from 'moment';
import FastImage from 'react-native-fast-image';

//Component
import StoryItem from './StoryItem';

//Redux
import {connect} from 'react-redux';
import {setStatusState, setMediaType} from '../../../store/actions';
import appConfig from '../../../utils/appConfig';

class StoryTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otherStories: [],
      myStories: [],
    };
  }
  componentDidMount = () => {
    let token = this.props.user.token;
    StoryServices.storyList(token).then(res => {
      this.setState({otherStories: res.data?.data?.other_stories});
      this.setState({myStories: res.data?.data?.my_stories});
    });
  };
  statusOpenCamera = () => {
    this.props.onSetStatus(true);
    this.props.onSetMediaType('camera');
  };
  imagePathSet = url => {
    let url2 = String(url);
    return url2.replace(/\\/g, '/');
  };
  render() {
    return (
      <View>
        <>
          {this.state?.myStories == null ? (
            <TouchableOpacity
              style={styles.mystoryMainView}
              onPress={() => this.statusOpenCamera()}>
              <ImageBackground
                source={require('../../../assets/deafultimage.png')}
                style={styles.ProfileView}>
                <View style={styles.addView}>
                  <Text style={styles.addText}>{'+'}</Text>
                </View>
              </ImageBackground>
              <View style={styles.mystoryTextView}>
                <Text style={styles.mystoryTextstatus}>My status</Text>
                <Text style={styles.mystoryTapText}>
                  Tap to add status update
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.mystoryMainView}>
              <TouchableOpacity
              onPress={() => {
                if (this.state?.myStories !== null) {
                  this.props.navProps.navigation.navigate("StatusViewer", {
                    stories: this.state?.myStories,
                  });
                } else {
                  Alert.alert("Please Upload the status!");
                }
              }}
              >
                {this.state?.myStories?.last_story_type === 2 ? (
                  <FastImage
                    source={{uri: this.state.myStories.avatar_url}}
                    style={styles.ProfileView}></FastImage>
                ) : 
                <FastImage
                  source={{
                    uri:
                      appConfig.LastStoryPath +
                      this.imagePathSet(
                        this.state?.myStories?.last_story?.path,
                      ),
                  }}
                  style={styles.ProfileView}></FastImage>
                }
              </TouchableOpacity>
              <View style={styles.mystoryTextView}>
                <Text style={styles.mystoryTextstatus}>My status</Text>
                <Text style={styles.mystoryTapText}>
                  {moment
                    .utc(this.state.myStories?.last_story_at)
                    .local('tr')
                    .fromNow()}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}>
                <TouchableOpacity onPress={() => this.statusOpenCamera()}>
                  <FontAwesome5
                    name={'camera'}
                    size={20}
                    color={'#008069'}
                    style={styles.IconCameraanddots}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navProps.navigation.navigate('MyStoryView')
                  }>
                  <FontAwesome5
                    name={'ellipsis-h'}
                    size={20}
                    color={'#008069'}
                    style={styles.IconCameraanddots}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={styles.recentUpdateStyle}>Recent Updates</Text>
          {this.state?.otherStories?.map(data => {
            return <StoryItem item={data} navProps={this.props.navProps} />;
          })}
        </>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    theme: state.auth.theme,
    user: state.auth.user,
    statusState: state.stateHandler.statusState,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetStatus: data => {
      dispatch(setStatusState(data));
    },

    onSetMediaType: data => {
      dispatch(setMediaType(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StoryTab);

const styles = StyleSheet.create({
  ProfileView: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 15,
    color: 'white',
    fontWeight: '700',
    marginTop: -1,
  },
  addView: {
    position: 'absolute',
    bottom: 1,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: '#008069',
    borderColor: 'white',
  },
  mystoryMainView: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  mystoryTextView: {
    marginLeft: '3%',
  },
  mystoryTextstatus: {
    fontSize: 14,
    marginBottom: 3,
    fontWeight: '500',
  },
  mystoryTapText: {
    fontSize: 12,
    color: '#A3A3A3',
  },
  recentUpdateStyle: {
    fontSize: 12,
    color: '#A3A3A3',
    backgroundColor: '#F2F2F2',
    padding: '2%',
    paddingLeft: '4%',
  },
  editButtonPosition: {
    position: 'absolute',
    top: '450%',
    right: '2%',
  },
  editButton: {
    width: 62,
    height: 62,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008069',
  },
  IconCameraanddots: {
    margin: '6%',
    marginTop: '1%',
  },
});
