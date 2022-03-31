import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';

import {VideoPlayer, Trimmer} from 'react-native-video-processing';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome5';

class PlayerAndTrimmer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      selectedMedia: props?.url,
      position: 0,
      images: [],
      currentTime: 0,
      startTime: 0,
      endTime: 0,
      viewHeight: 0,
      playVideo: false,
    };
  }

  crossButton = () => {
    this.setState({playVideo: false});
    this.props.crossButton();
  };

  trimVideo = () => {
    console.log('trimVideo');
    const options = {
      startTime: this.state.startTime,
      endTime: this.state.endTime,
      quality:
        Platform.OS == 'ios'
          ? VideoPlayer.Constants.quality.QUALITY_1280x720
          : '',
      saveToCameraRoll: false,
      saveWithCurrentDate: false,
    };
    this.videoPlayerRef
      .trim(options)
      .then(newSource => {
        this.setState({selectedMedia: newSource});
        this.props.tickBtn(newSource);
      })
      .catch(console.warn);
  };

  render() {
    const {page, selectedMedia, playVideo} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <View
          style={{
            flex: 0.07,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={this.crossButton}
            style={{
              flex: 0.5,
              justifyContent: 'center',
              paddingLeft: 10,
            }}>
            <FontAwesome name="times" size={30} color={'#fff'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.trimVideo}
            style={{
              flex: 0.5,
              justifyContent: 'center',
              paddingRight: 10,
              alignItems: 'flex-end',
            }}>
            <FontAwesome name="check" size={25} color={'#fff'} />
          </TouchableOpacity>
        </View>
        <View
          onLayout={({nativeEvent}) => {
            this.setState({viewHeight: nativeEvent.layout.height});
          }}
          style={{
            flex: 0.93,
            // height: '100%',
            // width: '100%',
          }}>
          <VideoPlayer
            ref={ref => (this.videoPlayerRef = ref)}
            startTime={this.state.startTime}
            endTime={this.state.endTime > 0 ? this.state.endTime : null}
            play={playVideo}
            replay={true}
            rotate={false}
            source={selectedMedia}
            playerWidth={Dimensions.get('window').width}
            playerHeight={this.state.viewHeight}
            style={{
              // backgroundColor: 'red',
              height: '80%',
              width: '100%',
            }}
            resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
            onChange={({nativeEvent}) => {
              console.log('nativeEvent: ', nativeEvent.currentTime);
              this.setState({currentTime: nativeEvent.currentTime});
            }}
          />

          <Trimmer
            source={selectedMedia}
            height={50}
            width={Dimensions.get('window').width}
            onTrackerMove={e => {
              console.log('currentTime: ', e);
              // this.setState({currentTime: e.currentTime});
            }}
            currentTime={this.state.currentTime}
            themeColor={'green'}
            thumbWidth={30}
            trackerColor={'red'}
            onChange={e =>
              this.setState({startTime: e.startTime, endTime: e.endTime})
            }
          />

          <TouchableOpacity
            onPress={() => this.setState({playVideo: !this.state.playVideo})}
            style={{
              position: 'absolute',
              right: 0,
              left: 0,
              top: '45%',
              height: 100,
              // backgroundColor: 'pink',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {playVideo ? (
              <FontAwesome name="pause-circle" size={50} color="#fff" />
            ) : (
              <FontAwesome name="play-circle" size={50} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default PlayerAndTrimmer;

const styles = StyleSheet.create({});
