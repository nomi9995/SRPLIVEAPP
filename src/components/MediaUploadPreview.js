import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Text,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome5';
import PhotoEditor from '@baronha/react-native-photo-editor';
import PagerView from 'react-native-pager-view';
import Video from 'react-native-video';
import {
  VESDK,
  VideoEditorModal,
  Configuration,
} from 'react-native-videoeditorsdk';

//Redux
import {connect} from 'react-redux';
import {
  setImagePreview,
  setMediaType,
  setMediaUploadState,
  setStatusState,
} from '../store/actions';

// Components
import PlayerAndTrimmer from './PlayerAndTrimmer';

class MediaUploadPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      selectedMedia: props?.selectedMedia,
      position: 0,
      images: [],
      currentTime: 0,
      startTime: 0,
      endTime: 0,
      viewHeight: 0,
      playVideo: true,
      doTrimming: false,
    };
  }

  sendHandler = caption => {
    this.props.onSetMediaUploadState(true);
    this.props.onUploadMedia(this.state.selectedMedia, caption);
  };

  renderHeader(SliderImages) {
    return (
      <SafeAreaView style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            flex: 0.5,
            paddingVertical: 10,
            paddingLeft: 10,
          }}
          disabled={this.props.mediaUploadState}
          onPress={() => this.crossButton()}>
          <FontAwesome name="times" size={30} color={'#fff'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 0.5,
            paddingVertical: 10,
            paddingRight: 10,
            alignItems: 'flex-end',
          }}
          disabled={this.props.mediaUploadState}
          onPress={async () => {
            const options = {
              path: SliderImages[this.state.position],
            };
            const result = await PhotoEditor.open(options);
            console.log('result: ', result);
            if (this.state.images.length > 0) {
              this.state.images[this.state.position] = result;
              this.setState({images: this.state.images});
            } else {
              SliderImages[this.state.position] = result;
              this.setState({images: SliderImages});
            }
          }}>
          <FontAwesome name="edit" size={25} color={'#fff'} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  crossButton = () => {
    if (this.props.statusState === true) {
      this.props.onSetImagePreview(false);
      this.props.onSetMediaType(null);
      this.props.onSetStatus(false);
      this.props.onSetMediaUploadState(false);
    } else if (this.props.mediaType === 'document') {
      this.props.onSetMediaType(null);
    } else if (this.state.doTrimming) {
      this.setState({doTrimming: false});
    } else {
      this.setState({playVideo: true});
      this.props.onSetImagePreview(false);
      this.props.onSetMediaType(null);
      this.props.onSetMediaUploadState(false);
    }
  };

  editButton = async (trimmedUrl = '') => {
    const {page, selectedMedia} = this.state;
    let type = selectedMedia[page].type.split('/')[0];
    if (type === 'image') {
      const options = {
        path: selectedMedia[page].uri,
      };

      const result = await PhotoEditor.open(options);
      selectedMedia[page].uri = result;
      this.setState({selectedMedia: selectedMedia});
    } else {
      if (typeof trimmedUrl === 'string') {
        selectedMedia[page].uri = trimmedUrl;
        this.setState({selectedMedia: selectedMedia, doTrimming: false});
      } else {
        this.setState({
          doTrimming: true,
          playVideo: true,
        });
      }
    }
  };

  renderFooter() {
    let caption;
    return (
      <View style={styles.footerFlex}>
        {!this.props.statusState && (
          <TextInput
            placeholder="Write a Caption!"
            style={styles.textInput}
            onChangeText={val => (caption = val)}
          />
        )}
        <TouchableOpacity
          onPress={() => this.sendHandler(caption)}
          style={styles.micIcon}>
          <FontAwesome name={'paper-plane'} size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let caption = '';
    const {page, selectedMedia, playVideo, doTrimming} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
        {!doTrimming && (
          <View
            style={{
              flex: 0.07,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={this.crossButton}
              disabled={this.props.mediaUploadState}
              style={{
                flex: 0.5,
                justifyContent: 'center',
                paddingLeft: 10,
              }}>
              <FontAwesome name="times" size={30} color={'#fff'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.editButton}
              disabled={this.props.mediaUploadState}
              style={{
                flex: 0.5,
                justifyContent: 'center',
                paddingRight: 10,
                alignItems: 'flex-end',
              }}>
              <FontAwesome name="edit" size={25} color={'#fff'} />
            </TouchableOpacity>
          </View>
        )}

        <PagerView
          keyboardDismissMode={'on-drag'}
          transitionStyle={'curl'}
          style={{flex: 0.86}}
          onPageSelected={async e => {
            await this.setState({page: e.nativeEvent.position});
          }}>
          {selectedMedia.map((media, index) => {
            let type = media.type.split('/')[0];
            // this.setState({playVideo: page === index ? true : false});
            return (
              <View
                key={index}
                style={{
                  flex: 1,
                }}>
                {type === 'image' ? (
                  <FastImage
                    source={{uri: media.uri}}
                    style={{height: '100%', width: '100%'}}
                    resizeMode={'contain'}
                  />
                ) : type === 'video' ? (
                  doTrimming ? (
                    <PlayerAndTrimmer
                      url={media.uri}
                      tickBtn={trimmedUrl => {
                        console.log('trimmedUrl: ', trimmedUrl);
                        this.editButton(trimmedUrl);
                      }}
                      crossButton={() => {
                        this.setState({doTrimming: false});
                      }}
                    />
                  ) : (
                    <VideoEditorModal visible={true} video={{uri: media.uri}} />
                    // <Video
                    //   source={{uri: media.uri}}
                    //   paused={playVideo}
                    //   controls={true}
                    //   repeat={true}
                    //   ignoreSilentSwitch={'ignore'}
                    //   playInBackground={false}
                    //   resizeMode={'contain'}
                    //   style={{
                    //     height: '100%',
                    //     width: '100%',
                    //   }}
                    // />
                  )
                ) : null}
              </View>
            );
          })}
        </PagerView>

        {!doTrimming &&
          (this.props.mediaUploadState ? (
            <View style={{flex: 0.07, flexDirection: 'row'}}>
              <ActivityIndicator size="large" color="#008069" />
              <Text style={{color: 'white', fontSize: 20}}>
                {parseInt(this.props.progressData)} %
              </Text>
            </View>
          ) : (
            <View style={{flex: 0.07, flexDirection: 'row'}}>
              <View
                style={{
                  flex: 0.9,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                }}>
                {!this.props.statusState && (
                  <TextInput
                    placeholder="Write a Caption!"
                    onChangeText={val => (caption = val)}
                    style={{
                      borderRadius: 25,
                      backgroundColor: '#fff',
                      height: '100%',
                      width: '100%',
                    }}
                  />
                )}
              </View>
              <View
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                }}>
                <TouchableOpacity
                  onPress={() => this.sendHandler(caption)}
                  style={{
                    backgroundColor: '#018679',
                    borderRadius: 50,
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FontAwesome name={'paper-plane'} size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>
      // <View style={styles.bgView}>
      //   {this.renderHeader(SliderImages)}
      //   <KeyboardAvoidingView
      //     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      //     style={styles.keyboardContainer}>
      //     {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
      //       <View style={styles.inner}>
      //         {messageTypeState === 2 ? (
      //           <PagerView initialPage={0} orientation='horizontal' scrollEnabled={true} style={{flex: 1}}>
      //             {
      //               SliderImages.map((img, ind) => {
      //                 console.log('img: ', img);
      //                 return (
      //                   <View key={ind} style={{
      //                     flex: 1,
      //                     backgroundColor: 'pink',
      //                     // alignItems: 'center',
      //                     // justifyContent: 'center'
      //                   }}>
      //                     <FastImage
      //                       source={{uri: img}}
      //                       style={{height: '100%', width: '100%'}}
      //                       resizeMode="contain"
      //                     />
      //                   </View>
      //                 )
      //               })
      //             }
      //           </PagerView>
      //           // <SliderBox
      //           //   images={this.state.images.length > 0 ? this.state.images : SliderImages}
      //           //   sliderBoxHeight={'90%'}
      //           //   resizeMode={'contain'}
      //           //   currentImageEmitter={index => this.setState({position: index})}
      //           // />
      //         ) : messageTypeState === 6 ? (
      //           <View style={styles.fileUploadContainer}>
      //             {selectedMedia.map((res, ind) => {
      //               return ind < 6 ? (
      //                 <View style={styles.fileUploadView}>
      //                   {ind === 5 && selectedMedia.length > 6 ? (
      //                     <View style={styles.moreContainer}>
      //                       <Text style={styles.moreText}>
      //                         +{selectedMedia.length - 5} More
      //                       </Text>
      //                     </View>
      //                   ) : (
      //                     <>
      //                       <View style={styles.fileUpload}>
      //                         <FontAwesome
      //                           name="file-pdf"
      //                           style={styles.fileUploadIcon}
      //                         />
      //                       </View>
      //                       <View style={{marginTop: '5%'}}>
      //                         <Text
      //                           style={styles.fileUploadText}
      //                           numberOfLines={3}>
      //                           {res?.name}
      //                         </Text>
      //                       </View>
      //                     </>
      //                   )}
      //                 </View>
      //               ) : null;
      //             })}
      //           </View>
      //         ) : messageTypeState === 11 ? (
      //           <View style={styles.fileUploadContainer}>
      //             {selectedMedia?.map((res, ind) => {
      //               return ind < 6 ? (
      //                 <View style={styles.fileUploadView}>
      //                   {ind === 5 && selectedMedia.length > 6 ? (
      //                     <View style={styles.moreContainer}>
      //                       <Text style={styles.moreText}>
      //                         +{selectedMedia.length - 5} More
      //                       </Text>
      //                     </View>
      //                   ) : (
      //                     <>
      //                       <Video
      //                         source={{uri: res?.uri}}
      //                         style={styles.fileUpload}
      //                         paused={true}
      //                         controls={true}
      //                         poster={res?.uri}
      //                         muted={true}
      //                       />
      //                       <TouchableOpacity
      //                         style={{
      //                           backgroundColor: 'red',
      //                           height: 20,
      //                           width: 20,
      //                         }}
      //                         onPress={async () => {
      //                           const Options = {
      //                             path: res?.uri,
      //                           };
      //                           const result = await PhotoEditor.open(Options);
      //                           console.log('result: ', result);
      //                         }}>
      //                         <Text>Edit</Text>
      //                       </TouchableOpacity>
      //                       {/* <FastImage
      //                         source={{
      //                           uri:
      //                             this.props.mediaType === 'gallery' &&
      //                             Platform.OS == 'ios'
      //                               ?  res?.uri
      //                               : res?.uri,
      //                         }}
      //                         style={styles.fileUpload}
      //                       /> */}
      //                       <View style={{marginTop: '5%'}}>
      //                         <Text
      //                           style={styles.fileUploadText}
      //                           numberOfLines={3}>
      //                           {res?.name}
      //                         </Text>
      //                       </View>
      //                     </>
      //                   )}
      //                 </View>
      //               ) : null;
      //             })}
      //           </View>
      //         ) : messageTypeState === 3 ? (
      //           <FastImage
      //             style={{width: '100%', height: '100%'}}
      //             source={{
      //               uri: selectedMedia,
      //             }}
      //             resizeMode={'contain'}
      //           />
      //         ) : null}
      //         {this.props.mediaUploadState ? (
      //           <View style={styles.footerLoader}>
      //             <ActivityIndicator size="large" color="#008069" />
      //             <Text style={{color: 'white', fontSize: 20}}>
      //               {parseInt(this.props.progressData)} %
      //             </Text>
      //           </View>
      //         ) : (
      //           <View style={styles.bottomFooter}>{this.renderFooter()}</View>
      //         )}
      //       </View>
      //     {/* </TouchableWithoutFeedback> */}
      //   </KeyboardAvoidingView>
      // </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    imagePreview: state.stateHandler.imagePreview,
    mediaType: state.stateHandler.mediaType,
    mediaUploadState: state.stateHandler.mediaUploadState,
    statusState: state.stateHandler.statusState,
    previewType: state.stateHandler.previewType,
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
    onSetMediaUploadState: data => {
      dispatch(setMediaUploadState(data));
    },
    onSetStatus: data => {
      dispatch(setStatusState(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaUploadPreview);

const styles = StyleSheet.create({
  bgView: {
    flex: 1,
    // backgroundColor: 'black',
  },
  crossIcon: {
    color: 'white',
    fontSize: 30,
    alignSelf: 'flex-end',
    paddingHorizontal: '5%',
    paddingTop: '5%',
  },
  footerFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'flex-end',
  },
  footerLoader: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 45,
    width: '83%',
    backgroundColor: 'white',
    marginHorizontal: '2%',
    borderRadius: 30,
    paddingHorizontal: 10,
  },

  micIcon: {
    backgroundColor: '#018679',
    height: 45,
    width: 45,
    borderRadius: 50 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardContainer: {
    flex: 1,
    marginTop: '10%',
  },
  inner: {
    flex: 1,
    // justifyContent: 'space-around',
  },
  fileUploadContainer: {
    flex: 1,
    // alignItems: 'center',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
  },
  fileUploadView: {
    // alignItems: 'center',
    // height: '30%',
    // margin: '2%',
    // width: '46%',
  },
  fileUpload: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: '70%',
    height: '70%',
  },
  fileUploadIcon: {
    color: '#06A88E',
    fontSize: 40,
    padding: '3%',
    alignSelf: 'center',
    marginTop: '30%',
    fontFamily: 'Roboto-Regular',
  },
  fileUploadText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
    width: 100,
  },
  bottomFooter: {
    overflow: 'hidden',
    marginRight: 10,
  },
  moreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  moreText: {
    color: '#fff',
    fontSize: 30,
  },
});
