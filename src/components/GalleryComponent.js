import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  ImageBackground,
  BackHandler,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';

//Redux
import {connect} from 'react-redux';
import {setMediaType, setImagePreview,setPreviewType} from '../store/actions';

const WIDTH = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

class GalleryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      galleryDetailData: [],
      selectedMedia: [],
      hasNext: true,
      endCursor: '0',
    };
  }

  async componentDidMount() {
    this.getPhotosFromGallery();
  }

  getPhotosFromGallery = async () => {
    if (this.state.hasNext) {
      if (Platform.OS == 'android') {
        CameraRoll.getPhotos({
          first: 30,
          assetType: 'All',
          after: this.state.endCursor,
          include: ['playableDuration', 'filename'],
        }).then(res => {
          this.setState({
            galleryDetailData: [...this.state.galleryDetailData, ...res.edges],
            hasNext: res.page_info.has_next_page,
            endCursor: res.page_info.end_cursor,
          });
        });
      } else {
        CameraRoll.getPhotos({
          first: 1000,
          assetType: 'All',
          include: ['playableDuration', 'filename'],
        }).then(res => {
          this.setState({
            galleryDetailData: [...this.state.galleryDetailData, ...res.edges],
            hasNext: res.page_info.has_next_page,
            endCursor: res.page_info.end_cursor,
          });
        });
      }
    }
  };

  pressSelect = (res, i) => {
    var dataUri = '';
    var isadd = true;
    this.state.selectedMedia.map((data, i1) => {
      dataUri = data.node.image.uri;
      if (res.node.image.uri === data.node.image.uri) {
        let array = this.state.selectedMedia;
        array.splice(i1, 1);
        this.setState({selectedMedia: array});
        isadd = false;
      }
    });
    if (isadd) {
      let array = this.state.selectedMedia;
      array.push(res);
      this.setState({selectedMedia: array});
    }
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  getItem = (data, index) => ({
    id: index,
    uri: data[index],
  });

  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => this.pressSelect(item, index)}>
        <ImageBackground
          source={{uri: item.node.image.uri}}
          style={styles.image}
          resizeMode="cover">
          <View style={styles.overlay} />
          {this.state.selectedMedia.map(res2 => {
            return (
              <>
                {item.node.image.uri === res2.node.image.uri ? (
                  <FontAwesome5 name={'check'} size={20} color={'white'} />
                ) : null}
              </>
            );
          })}
          {item.node.type === 'video/mp4' ||
            (item.node.type === 'video' && (
              <FontAwesome5
                name={'play-circle'}
                size={40}
                color={'white'}
                style={styles.backImageText}
              />
            ))}
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <>
        <View style={styles.galleryHeader}>
          <View style={styles.galleryHeaderButtonView}>
            <TouchableOpacity onPress={() => this.props.onSetMediaType(null)}>
              <FontAwesome5 name={'arrow-left'} size={20} color={'white'} />
            </TouchableOpacity>
            {this.state.selectedMedia.length > 0 && (
              <Text style={styles.slectionCount}>
                {this.state.selectedMedia.length}
              </Text>
            )}
          </View>
          {this.state.selectedMedia.length > 0 && (
            <TouchableOpacity
              onPress={() =>
                {
                this.props.selectedMedia(this.state.selectedMedia)
                this.props.onSetPreviewType('Gallery')
              }
              }
              >
              <Text style={{color: 'white'}}>OK</Text>
            </TouchableOpacity>
          )}
        </View>
        <SafeAreaView style={styles.imageContainer}>
          <FlatList
            data={this.state.galleryDetailData}
            keyExtractor={(data, index) => index}
            renderItem={this.renderItem}
            numColumns={3}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.7}
            onEndReached={this.getPhotosFromGallery}
          />
        </SafeAreaView>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    user: state.auth.user,
    theme: state.auth.theme,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetMediaType: data => {
      dispatch(setMediaType(data));
    },
    onSetImagePreview: data => {
      dispatch(setImagePreview(data));
    },

    onSetPreviewType: data => {
      dispatch(setPreviewType(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GalleryComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
    // marginTop: '5%'
  },

  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: WIDTH * 0.3,
    height: Height * 0.2,
    margin: '1%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.3,
  },
  heading: {
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
  },
  headingText: {
    color: 'white',
    fontSize: 10,
    marginLeft: '5%',
    marginBottom: '5%',
  },
  backImageText: {
    flex: 1,
    marginTop: Height * 0.08,
    alignSelf: 'center',
  },
  galleryHeader: {
    backgroundColor: '#008069',
    padding: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 0,
  },
  galleryHeaderButtonView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  slectionCount: {
    paddingLeft: '5%',
    fontSize: 15,
    color: 'white',
  },
});
