import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome5';
//Redux
import {setAuthUser, setStickers} from '../../store/actions';
import {connect} from 'react-redux';

//Services
import ChatServices from '../../services/ChatServices';
import { MessagesQuieries, ChatUsersQuieries } from '../../database/services/Services';
//Component
import MessageActionHeader from '../../components/headers/MessageActionHeader';
import MessageBubble from '../../components/MessageBubble';

class AcknowledgementMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ApiLoader: true,
      activeTab: 0,
      receiveChat: [],
      requestChat: [],
    };
  }

  componentDidMount = () => {
    
    if(this.props.route.params?.userData === 'singleUserData'){
      this.getAllMsgsFromDb();
    }else{
      let token = this.props.user?.token;
      ChatServices.acknowledgeList(token).then((res) => {
        this.setState({receiveChat: res?.data?.data?.ack_receive_chats});
        this.setState({requestChat: res?.data?.data?.ack_request_chats})
      });
    }
    
  };
  getAllMsgsFromDb = () => {
    let onlineUserId = this.props.user?.user.id;
    let chatUserId = 0;
    if (this.props?.route?.params?.selectedUser?.user_id === undefined) {
      chatUserId = this.props?.route?.params.selectedUser.id;
    } else {
      chatUserId = this.props?.route?.params.selectedUser.user_id;
    }
    let ackrequested = '1'
    let temparr=[]
    MessagesQuieries.selectDbSingleListmessageackrequested({ onlineUserId, chatUserId , ackrequested }, res2 => {
      res2.map((reponse) => {
        if(reponse.sender_id == this.props.user?.user.id ){
          temparr.push(reponse)
          this.setState({requestChat: temparr})
        }else{
          temparr.push(reponse)
          this.setState({receiveChat: temparr})
        }

      })
      // this.setState({ starredList: res2 })
      // this.setMessageAsGifted(res2, true);
    });
  };

  render() {
    const {theme, navigation} = this.props;

    return (
      <View style={styles.container}>
        <MessageActionHeader navProps={this.props} screen="Acknowledgement" />
        <View style={styles.container}>
          <View style={styles.tabFlex}>
            <TouchableOpacity
              onPress={() => {
                this.setState({activeTab: 0});
              }}
              style={
                this.state.activeTab !== 0
                  ? styles.tabDesign
                  : styles.activeTabDesign
              }>
              <Text
                style={
                  this.state.activeTab !== 0
                    ? styles.tabText
                    : styles.activeTabText
                }>
                Recieved
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({activeTab: 1});
              }}
              style={
                this.state.activeTab !== 1
                  ? styles.tabDesign
                  : styles.activeTabDesign
              }>
              <Text
                style={
                  this.state.activeTab !== 1
                    ? styles.tabText
                    : styles.activeTabText
                }>
                Request
              </Text>
            </TouchableOpacity>
          </View>

          {this.state.activeTab === 0 && (
            <ScrollView >
              {this.state.receiveChat?.map(messages => {
                return(
                <View style={styles.AcknowledgementMainView}>
                  <Text style={styles.acknowledgementUserName}>
                  {messages?.first_name +" "+ messages?.last_name}
                  </Text>
                  <View style={styles.acknowledgementMessageText}>
                  <MessageBubble starredList={true} currentMessage={messages} />
                  </View>
                  <TouchableOpacity style={styles.AcknowledgementButton}>
                    <FontAwesome
                      name={'hand-point-up'}
                      size={13}
                      color={'#FFD700'}
                    />
                    <Text> Acknowledgement accepted?</Text>
                  </TouchableOpacity>
                </View>
                )
              })}
            </ScrollView>
          )}
          {this.state.activeTab === 1 && (
            <ScrollView >
              {this.state.requestChat?.map(messages => {
                return(
                <View style={styles.AcknowledgementMainView}>
                  <Text style={styles.acknowledgementUserName}>
                    {messages?.first_name + messages?.last_name}
                  </Text>
                  <View style={styles.acknowledgementMessageText}>
                  <MessageBubble starredList={true} currentMessage={messages} />
                  </View>
                </View>
                )
              })}
            </ScrollView>
          )}
        </View>
      </View>
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AcknowledgementMessage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  cardDesign: {
    padding: '5%',
  },
  Loader_container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 700,
  },
  header: {
    justifyContent: 'space-between',
    marginTop: '2%',
    backgroundColor: '#008069',
  },
  tabFlex: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: '5%',
    paddingBottom: '2%',
  },
  tabDesign: {
    paddingHorizontal: '5%',
    paddingBottom: '1%',
    width: '40%',
    alignItems: 'center',
  },
  activeTabDesign: {
    paddingHorizontal: '5%',
    paddingBottom: '1%',
    width: '40%',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'green',
  },
  tabText: {
    fontSize: 20,
  },
  activeTabText: {
    fontSize: 20,
    color: 'green',
  },
  AcknowledgementMainView: {
    backgroundColor: '#FAFAFA',
    marginVertical: '2%',
    marginHorizontal: '6%',
    elevation: 5,
    borderRadius: 10,
  },
  acknowledgementUserName: {
    color: '#7A94DF',
    marginLeft: 10,
  },
  acknowledgementMessageText: {
    marginVertical: '1%',
    marginHorizontal: '3%',
  },
  AcknowledgementButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1CC88A',
    margin: 5,
  },
});
