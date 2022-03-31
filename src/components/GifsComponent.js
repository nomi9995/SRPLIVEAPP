import React, {Component} from 'react';
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
//Redux
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import {setMediaType, setImagePreview, setPreviewType} from '../store/actions';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import {ScrollView} from 'react-native-gesture-handler';
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};
class GifsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gifsList: [],
      searchGif: '',
      leftlist: [],
      rightlist: [],
      next: '',
    };
  }

  async componentDidMount() {
    this.getGifs();
  }

  paginationOftrending = () => {
    this.getGifs();
  };

  getGifs = () => {
    var config = {
      method: 'get',
      url: `https://api.tenor.com/v1/trending?key=J8KEXNHQ3TNL&media_filter=minimal&ar_range=standard&limit=50&pos=${this.state.next}`,
      headers: {},
    };

    axios(config)
      .then(response => {
        this.setState({gifsList: response.data.results});
        this.setState({next: response.data.next});
        this.setArrayList(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handlePress = data => {
    this.props.selectedMedia(data.media[0].gif.url);
  };

  setArrayList = response => {
    if (response.data.results.length > 0) {
      let leftlist = [
        ...this.state.leftlist,
        ...response.data.results.slice(0, response.data.results.length / 2),
      ];
      let rightlist = [
        ...this.state.rightlist,
        ...response.data.results.slice(
          response.data.results.length / 2,
          response.data.results.length,
        ),
      ];
      this.setState({leftlist: leftlist});
      this.setState({rightlist: rightlist});
    }
  };

  searchGifData = query => {
    this.setState({searchGif: query});
    this.setState({gifsList: []});
    this.setState({leftlist: []});
    this.setState({rightlist: []});
    this.setState({next: ''});
    this.searchApi(query);
  };

  searchApi = () => {
    var config = {
      method: 'get',
      url: `https://api.tenor.com/v1/search?q=${this.state.searchGif}&key=J8KEXNHQ3TNL&media_filter=minimal&ar_range=standard&limit=50`,
      headers: {},
    };

    axios(config)
      .then(response => {
        this.setState({gifsList: response.data.results});
        this.setState({next: response.data.next});
        this.setArrayList(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          marginVertical: '1%',
          backgroundColor: 'lightgrey',
          marginBottom: '1%',
        }}
        onPress={() => this.handlePress(item)}>
        <FastImage
          style={{
            width: windowWidth * 0.48,
            height:
              (item.media[0].gif.dims[1] / item.media[0].gif.dims[0]) *
              windowWidth *
              0.48,
          }}
          source={{
            uri: item.media[0].gif.url,
          }}
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <>
        <SafeAreaView style={{backgroundColor: '#008069'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 5,
              paddingBottom: '7%',
            }}>
            <TouchableOpacity
              onPress={() => this.props.onSetMediaType(null)}
              style={{paddingHorizontal: '2%'}}>
              <FontAwesome name={'arrow-left'} size={20} color={'white'} />
            </TouchableOpacity>
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search"
              placeholderTextColor="white"
              value={this.state.searchGif}
              selectionColor="white"
              onChangeText={text => this.searchGifData(text)}
            />
          </View>
        </SafeAreaView>

        <ScrollView
          removeClippedSubviews={true}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              this.state.searchGif = ''
                ? this.paginationOftrending()
                : this.searchApi();
            }
          }}
          scrollEventThrottle={400}>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <View>
              {this.state.leftlist.map((item, index) =>
                this.renderItem({item, index}),
              )}
            </View>
            <View>
              {this.state.rightlist.map((item, index) =>
                this.renderItem({item, index}),
              )}
            </View>
          </View>
          {this.state.next ? (
            <ActivityIndicator size={'large'} color={'green'} />
          ) : null}
        </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(GifsComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerinner: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  gifContainer: {
    maxHeight: 160,
    maxWidth: '31%',
    margin: '1%',
    backgroundColor: 'lightgrey',
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
  searchTextInput: {
    width: '80%',
    // height: Platform.OS == 'android' ? '1%' : '100%',s
    color: 'white',
  },
});
