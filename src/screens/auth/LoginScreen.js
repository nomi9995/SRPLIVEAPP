import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  keyBoard,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {White} from '../../themes/constantColors';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome5';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import AsyncStorage from '@react-native-community/async-storage';
import RNRestart from 'react-native-restart';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

//Redux
import {setAuthUser, setStickers, setReloader} from '../../store/actions';
import {connect} from 'react-redux';

//Services
import UserService from '../../services/UserService';
import ChatServices from '../../services/ChatServices';
// import AppFonts from '../../assets/fonts';

//DataBase
import {
  MessagesQuieries,
  ChatUsersQuieries,
  LogoutQueries,
} from '../../database/services/Services';
import {duration} from 'moment';
import {SafeAreaView} from 'react-native-safe-area-context';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '639@srp.com.tr',
      password: '123456',
      AuthData: null,
      scrollCheck: false,
    };
  }
  componentDidMount = () => {
    MessagesQuieries.delete();
    ChatUsersQuieries.delete();
  };

  onLogin = () => {
    showMessage({
      message: 'Please Wait!',
      type: 'info',
    });
    this.setState({loader: true});
    let email = this.state.email;
    let password = this.state.password;
    let device = 2;
    UserService.login({email, password, device}, true).then(response => {
      this.PushNotification(response);
      if (response.data.data.length !== 0) {
        showMessage({
          message: 'Login Successful',
          type: 'success',
          position: {top: 30},
        });
        Toast.show('Login Successfully.', Toast.LONG);

        if (response.data.errors.length === 0) {
          this.setState({AuthData: response.data.data});
          ChatServices.stickerList(response.data.data.token).then(res => {
            this.props.onSetStickers(res.data.data.stickers);
          });
          this.localDbMethod();
        } else {
          if (response.data.errors[0]?.password !== undefined) {
            Alert.alert(response.data.errors[0]?.password[0]);
          } else if (response.data.errors[0]?.email !== undefined) {
            Alert.alert(response.data.errors[0]?.email[0]);
          }
          this.setState({loader: false});
        }
      } else {
        showMessage({message: 'Login Failed', type: 'warning'});
        this.setState({loader: false});
        Toast.show('Login Failed.', Toast.LONG);
      }
    });
  };

  localDbMethod = () => {
    ChatUsersQuieries.create('users_list_table');
    LogoutQueries.create('logout_time_table');
    MessagesQuieries.create('messages_list_table');
    this.getAllUpdatedMessages();
    // MessagesQuieries.delete();
    // ChatUsersQuieries.delete()
  };

  getAllUpdatedMessages = () => {
    let userId = this.state.AuthData.user.id;
    this.props.onSetReloader(true);

    LogoutQueries.checkUserExsist({userId}, res => {
      this.getUpdateMessagewithLogouttime(this.state.AuthData.user.created_at);
      // if (res) {
      //   LogoutQueries.getLogoutTime({userId}, res2 => {
      //     // this.props.onSetAuthUser(this.state.AuthData);
      //     this.getUpdateMessagewithLogouttime(res2[0].logout_time);
      //   });
      // } else {
      //   this.getUpdateMessagewithLogouttime(
      //     this.state.AuthData.user.created_at,
      //   );
      // }
    });
  };

  getUpdateMessagewithLogouttime = data => {
    let payload = {
      after: data,
    };
    let token = this.state.AuthData.token;
    ChatServices.updatedMessages(payload, token).then(res => {
      let tableName = 'messages_list_table';
      let resp = res;
      let onlineUserId = this.state.AuthData.user.id;

      MessagesQuieries.insertAndUpdateMessageList(
        {tableName, resp, onlineUserId},
        res3 => {
          this.getUpdateMessageList();
        },
      );
    });
  };
  getUpdateMessageList = () => {
    let token = this.state.AuthData.token;
    ChatServices.ALLUserList(token).then((res, err) => {
      this.props.onSetAuthUser(this.state.AuthData);

      ChatUsersQuieries.insertAndUpdateUserListonlogin(
        'users_list_table',
        res.data.data.chat_list,
        this.props.user.user.id,
        res4 => {
          console.log('res4', res4);
          if (res4) {
            this.addRecentListToDB();
          }
        },
      );
    });
  };

  addRecentListToDB = () => {
    this.setState({DataLoader: true});
    let user_list_section = 'recent';
    let page = this.state.pageNum;
    let token = this.props.user?.token;
    ChatServices.getUserList({user_list_section, page}, token).then(
      async res => {
        console.log('APiresponse', res);
        if (res.data.errors == 'Unauthorized') {
          Alert.alert(
            'Unauthorized',
            'This user is already logged in on another device.',
            [
              {
                text: 'OK',
                onPress: () => {
                  this.props.onSetAuthUser(null);
                  this.props.navigation.replace('LoginScreen');
                },
              },
            ],
          );
        } else {
          if (page > 1) {
          } else {
            ChatUsersQuieries.insertAndUpdateUserListonlogin(
              'users_list_table',
              res.data.data.chat_list,
              this.props.user.user.id,
              res => {
                console.log('ressadasdasdasdasdsadasdassadsad', res);
                // this.getUSerDataDb();
                this.setState({loader: false});
                this.props.onSetReloader(false);
                RNRestart.Restart();
              },
            );
          }
        }
      },
    );
  };

  PushNotification = async response => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let token = fcmToken;
    let device = response.data.data.device;
    let authtoken = response.data.data.token;

    ChatServices.notificationPush({token, device}, authtoken).then(res => {});
  };

  render() {
    const {theme, navigation} = this.props;
    const keyboardVerticalOffset = Platform.OS === 'ios' ? -60 : 0;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior="position"
          keyboardVerticalOffset={keyboardVerticalOffset}
          style={{flexGrow: 1, backgroundColor: 'white'}}>
          {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss()} > */}
          {/* <SafeAreaView style={{backgroundColor: '#008069'}}></SafeAreaView> */}
          <View
            style={{
              height: '37%',
              overflow: 'hidden',
              backgroundColor: 'white',
            }}>
            <Image
              source={require('../../assets/logo.png')}
              resizeMode="cover"
              style={{width: '100%', height: '100%'}}
            />
          </View>
          <View style={{backgroundColor: 'white'}}>
            <View style={{paddingHorizontal: 20, paddingVertical: '5%'}}>
              <Text style={[styles.titleText, {color: theme.primaryColor}]}>
                Enter Your Email and Password to login
              </Text>
              <View style={{flexDirection: 'row', marginTop: 40}}>
                <View style={styles.textInput}>
                  <Text
                    style={{
                      paddingVertical: '3%',
                      fontFamily: 'Roboto-Medium',
                    }}>
                    Email
                  </Text>
                  <TextInput
                    style={{
                      height: 40,
                      color: theme.primaryColor,
                      paddingLeft: '1%',
                    }}
                    value={this.state.email}
                    placeholder="abc@gmail.com"
                    placeholderTextColor={'grey'}
                    keyboardType={'email-address'}
                    onChangeText={email => this.setState({email})}
                  />
                </View>
              </View>
              <View style={{flexDirection: 'row', marginTop: 15}}>
                <View style={styles.textInput}>
                  <Text
                    style={{
                      paddingVertical: '3%',
                    }}>
                    Password
                  </Text>
                  <TextInput
                    style={{
                      height: 45,
                      color: theme.primaryColor,
                    }}
                    value={this.state.password}
                    placeholder="*******"
                    placeholderTextColor={'grey'}
                    keyboardType={'default'}
                    secureTextEntry={true}
                    onChangeText={password => this.setState({password})}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={{alignSelf: 'flex-end'}}
                onPress={() =>
                  this.props.navigation.navigate('ForgotPassword')
                }>
                <Text style={styles.ForgotText}>Forgot Password</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.continueView}
              onPress={() => this.onLogin()}>
              {this.state.loader ? (
                <ActivityIndicator size={'large'} color={'white'} />
              ) : (
                <FontAwesome name={'arrow-right'} size={20} color={'white'} />
              )}
            </TouchableOpacity>
            {/* </KeyboardAwareScrollView> */}
          </View>
          <FlashMessage style={{marginTop: 20}} position="top" />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

const mapStateToProps = state => {
  return {
    theme: state.theme.theme,
    user: state.auth.user,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetAuthUser: user => {
      dispatch(setAuthUser(user));
    },
    onSetStickers: stickers => {
      dispatch(setStickers(stickers));
    },

    onSetReloader: reloader => {
      dispatch(setReloader(reloader));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#008069',
  },
  innerView: {
    // flex: 1,
    backgroundColor: 'white',
    transform: [{scaleX: 2}],
    borderTopStartRadius: 200,
    borderTopEndRadius: 200,
    overflow: 'hidden',
    height: '100%',
  },
  icon: {
    width: 120,
    height: 90,
    marginTop: '20%',
    alignSelf: 'center',
    marginBottom: '10%',
  },
  titleText: {
    marginTop: 45,
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
  },
  descriptionText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  countryCodeView: {
    width: 80,
    height: 50,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#06A88E',
  },
  textInput: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#06A88E',
  },
  subDescriptionText: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  continueView: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
    backgroundColor: '#008069',
    marginHorizontal: '5%',
    // marginVertical: '5%',
  },
  continueText: {
    fontSize: 14,
    color: White,
    fontFamily: 'Roboto-Medium',
  },
  loginHeader: {
    backgroundColor: '#008069',
    // height: '35%',
    paddingBottom: '5%',
  },
  backImage: {
    width: '100%',
    height: '30%',
    resizeMode: 'cover',
    position: 'absolute',
    alignSelf: 'center',
  },
  ForgotText: {
    marginTop: '5%',
    alignSelf: 'flex-end',
    marginRight: '3%',
    color: 'grey',
    fontFamily: 'Roboto-Medium',
  },
});
