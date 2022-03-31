import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Platform,
  ImageBackground,
  Image,
  Switch,
  SafeAreaView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome5';
import {getFolderSize, formatBytes} from '../../../utils/regex';
//redux
import {connect} from 'react-redux';
import {
  setAuthUser,
  setAutoDocDownload,
  setAutoVideoDownload,
  setAutoPhotoDownload,
} from '../../../store/actions';
//Component
import MediaautoDownloadAndCompression from '../../../components/Modal/MediaautoDownloadAndCompression';

class DataandStorage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaAndCompression: false,
      compression: false,
      mediaAndCompressionVideo: false,
      mediaAndCompressionAudio: false,
      mediaAndCompressionDocs: false,
      ImageSize: {},
      VideoSize: {},
      FileSize: {},
      totalsize: 0,
    };
  }
  componentDidMount = () => {
    getFolderSize('Images').then(res => {
      this.setState({ImageSize: res});
      this.setState({totalsize: this.state.totalsize + res.recieve + res.send});
      console.log(res);
    });
    getFolderSize('Videos').then(res => {
      this.setState({VideoSize: res});
      this.setState({totalsize: this.state.totalsize + res.recieve + res.send});
      console.log(res);
    });
    getFolderSize('Files').then(res => {
      this.setState({FileSize: res});
      this.setState({totalsize: this.state.totalsize + res.recieve + res.send});
      console.log(res);
      console.log('totalsize', this.state.totalsize);
    });
  };
  CloseMediaOption = () => {
    this.setState({
      mediaAndCompressionVideo: false,
      mediaAndCompressionAudio: false,
      mediaAndCompressionDocs: false,
    });
    this.setState({compression: false});
  };
  setvideo = data => {
    console.log('video', data);
    this.props.onSetAutoVideoDownload(data);
    this.CloseMediaOption();
  };
  setaudio = data => {
    console.log('audio', data);
    this.props.onSetAutoPhotoDownload(data);
    this.CloseMediaOption();
  };
  setdoc = data => {
    console.log('docs', data);
    this.props.onSetAutoDocDownload(data);
    this.CloseMediaOption();
  };
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{backgroundColor: '#008069'}}>
          <View style={styles.headerview}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.navigation.goBack()}>
              <FontAwesome name={'arrow-left'} size={20} color={'white'} />
            </TouchableOpacity>
            <Text style={styles.settingText}>Data and Storage</Text>
          </View>
        </SafeAreaView>
        <ScrollView>
          <View style={styles.MediaautoMainView}>
            <Text style={styles.MediaautoText}>Media auto download</Text>
            <View style={styles.MediaAutoborderLine}></View>
            <TouchableOpacity
              style={styles.PhotVideoDocsView}
              onPress={() => this.setState({mediaAndCompressionAudio: true})}>
              <View style={styles.photoVideoDocsInnerView}>
                <FontAwesome
                  name={'image'}
                  size={25}
                  color={'lightgrey'}
                  style={{marginLeft: 5}}
                />
                <Text style={styles.photoVideoDocsText}>Photos</Text>
              </View>
              <Text style={styles.neverText}>{this.props.audioDownload}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.PhotVideoDocsView}
              onPress={() => this.setState({mediaAndCompressionVideo: true})}>
              <View style={styles.photoVideoDocsInnerView}>
                <FontAwesome
                  name={'play'}
                  size={25}
                  color={'lightgrey'}
                  style={{marginLeft: 5}}
                />
                <Text style={styles.photoVideoDocsText}>Videos </Text>
              </View>
              <Text style={styles.neverText}>{this.props.videoDownload}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.PhotVideoDocsView}
              onPress={() => this.setState({mediaAndCompressionDocs: true})}>
              <View style={styles.photoVideoDocsInnerView}>
                <FontAwesome
                  name={'file-alt'}
                  size={25}
                  color={'lightgrey'}
                  style={{marginLeft: 5}}
                />
                <Text style={styles.photoVideoDocsText}> Docs </Text>
              </View>
              <Text style={[styles.neverText, {marginLeft: '28%'}]}>
                {this.props.docsDownload}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.MediaautoMainView}>
            <Text style={styles.MediaautoText}>Image compression setting</Text>
            <View style={styles.MediaAutoborderLine}></View>
            <TouchableOpacity
              style={styles.PhotVideoDocsView}
              onPress={() =>
                this.setState({mediaAndCompression: true, compression: true})
              }>
              <View style={styles.photoVideoDocsInnerView}>
                <FontAwesome
                  name={'image'}
                  size={25}
                  color={'lightgrey'}
                  style={{marginLeft: 5}}
                />
                <Text style={styles.photoVideoDocsText}>Image compression</Text>
              </View>
              <Text style={[styles.neverText, {marginLeft: '12%'}]}>
                {this.props.user.user?.user_image_compression}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.MediaautoMainView}>
            <View
              style={[
                styles.PhotVideoDocsView,
                {justifyContent: 'space-between'},
              ]}>
              <Text style={{marginLeft: 5, fontSize: 16}}>Usage</Text>
              <Text style={[styles.UsageValue, {color: '#D5D05F'}]}>
                {formatBytes(this.state.totalsize)}
              </Text>
            </View>
            <View
              style={[
                styles.PhotVideoDocsView,
                {justifyContent: 'space-between'},
              ]}>
              <Text style={styles.photoVideoDocsText}>Video</Text>
              <Text style={styles.UsageValue}>
                {formatBytes(this.state.VideoSize?.send)} /
                {formatBytes(this.state.VideoSize?.recieve)}
              </Text>
            </View>
            <View
              style={[
                styles.PhotVideoDocsView,
                {justifyContent: 'space-between'},
              ]}>
              <Text style={styles.photoVideoDocsText}>Images</Text>
              <Text style={styles.UsageValue}>
                {formatBytes(this.state.ImageSize?.send)} /
                {formatBytes(this.state.ImageSize?.recieve)}
              </Text>
            </View>
            <View
              style={[
                styles.PhotVideoDocsView,
                {justifyContent: 'space-between'},
              ]}>
              <Text style={styles.photoVideoDocsText}>Files</Text>
              <Text style={styles.UsageValue}>
                {formatBytes(this.state.FileSize?.send)} /{' '}
                {formatBytes(this.state.FileSize?.recieve)}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={{alignSelf: 'center', marginVertical: '5%'}}>
            <Text style={{fontSize: 16, fontWeight: '700'}}>Clear Storage</Text>
          </TouchableOpacity>
        </ScrollView>
        {this.state.mediaAndCompressionAudio && (
          <MediaautoDownloadAndCompression
            openModal={this.state.mediaAndCompressionAudio}
            closeBottomModel={data => this.CloseMediaOption()}
            compressionsetting={this.state.compression}
            authToken={this.props.user.token}
            setdownload={data => this.setaudio(data)}
          />
        )}
        {this.state.mediaAndCompressionVideo && (
          <MediaautoDownloadAndCompression
            openModal={this.state.mediaAndCompressionVideo}
            closeBottomModel={data => this.CloseMediaOption()}
            compressionsetting={this.state.compression}
            authToken={this.props.user.token}
            setdownload={data => this.setvideo(data)}
          />
        )}
        {this.state.mediaAndCompressionDocs && (
          <MediaautoDownloadAndCompression
            openModal={this.state.mediaAndCompressionDocs}
            closeBottomModel={data => this.CloseMediaOption()}
            compressionsetting={this.state.compression}
            authToken={this.props.user.token}
            setdownload={data => this.setdoc(data)}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => {
  console.log('state', state);
  return {
    theme: state.theme.theme,
    user: state.auth.user,
    audioDownload: state.autoDownload.photo,
    videoDownload: state.autoDownload.video,
    docsDownload: state.autoDownload.docs,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetAuthUser: user => {
      dispatch(setAuthUser(user));
    },
    onSetAutoPhotoDownload: data => {
      dispatch(setAutoPhotoDownload(data));
    },
    onSetAutoVideoDownload: data => {
      dispatch(setAutoVideoDownload(data));
    },
    onSetAutoDocDownload: data => {
      dispatch(setAutoDocDownload(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataandStorage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerview: {
    backgroundColor: '#008069',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 4,
  },
  settingText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 5,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
  },
  MediaautoMainView: {
    backgroundColor: '#FAFAFA',
    marginVertical: '3%',
    // marginHorizontal: '2%',
    // elevation: 10,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 4,
    paddingTop: 5,
  },
  MediaautoText: {
    fontSize: 18,
    marginLeft: 5,
    paddingVertical: '5%',
  },
  MediaAutoborderLine: {
    borderBottomWidth: 2,
    borderBottomColor: '#F2F1EE',
  },
  PhotVideoDocsView: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    paddingVertical: '5%',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#F2F1EE',
    marginLeft: 5,
  },
  photoVideoDocsInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoVideoDocsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#38507A',
  },
  neverText: {
    fontSize: 16,
    fontWeight: '300',
    marginLeft: '25%',
  },
  UsageValue: {
    marginRight: 5,
    fontSize: 16,
  },
});
