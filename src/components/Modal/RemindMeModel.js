import React, {Component} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from 'moment';
import ChatServices from '../../services/ChatServices';
import Toast from 'react-native-simple-toast'

//redux
import {connect} from 'react-redux';

//services
import {
  MessagesQuieries,
} from '../../database/services/Services';

class RemindMeModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dob:'00-00-00',
      time:'00:00:00',
      repeat: -1,
      showDatePicker:false,
      showTimePicker:false,
    };
  }

  
  
  showIcon = () => {
    return (
      <View style={{marginTop: '3%'}}>
        <FontAwesome5 name={'chevron-down'} size={17} />
      </View>
    );
  };

  checkValues = () => {
    const {dob, time, repeat} = this.state
    if(dob !== '00-00-00' && time !== '00:00:00' && repeat !== -1) {
      return false
    } else {
      return true
    }
  }

  
  RemindLater = () => {
    const {longPress} = this.props;
    let token = this.props.user?.token;
    longPress.map(message => {
      let payload = {
        message_id: message._id,
        chat_type: message.chat_type,
        repeat_type : this.state.repeat,
        task_start_at : this.state.dob + this.state.time,
      };
      
      let Chatuser = message.chatUser;
      let Userid =  this.props.user.user.id
      ChatServices.remindMeLater(payload, token).then(res => {
        var messageId = message._id;
        var onlineUserId = Userid;
        var chatUserId = Chatuser;
        if(res.data.data.success){
          let remindme = 0
          if(res.data.data.message == "Message reminder updated"){
            remindme= 1
          }
          MessagesQuieries.updateMessageActionAsRmindme(
            {chatUserId, onlineUserId, messageId , remindme},
            res3 => {
              if(res3){
                MessagesQuieries.selectDb({ onlineUserId, chatUserId }, res2 => {
                  this.props.afterDbUpdate(res2)
                  // this.props.messageupdateresponse(res2)
                  // this.props.onSetOnLongPress([])
                  // this.props.callClose();
                });
              }
            },
          );
        }
      });
    });
  };




  closeModall = (data) => {
    this.props.closeModal(data)
  };
  render() {
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={true}
          onRequestClose={() => this.closeModall(false)}>

          <View style={styles.centeredView}>
            <TouchableOpacity  style={styles.modalOpacityView} />
            <View style={styles.modalView}>
              <View style = {{padding: 5, alignSelf: 'flex-start'}}>
                <Text style = {{padding: 10, fontSize: 24, fontWeight: 'bold'}}>Pick a Date and time</Text>
              </View>
              <View style = {{borderBottomColor: 'lightgrey', borderBottomWidth: 1, width: '100%'}} />
              
              <SelectDropdown
                renderDropdownIcon={this.showIcon}
                data={[
                  'Does not repeat',
                  'Repeat every 15 minutes',
                  'Repeat every 30 minutes',
                  'Repeat every hour',
                  'Repeat every 2 hour',
                  'Repeat every 6 hour',
                  'Repeat every day',
                  'Repeat every week',
                ]}
                
                buttonStyle={{
                  height: 40,
                  margin: '2%',

                  width: '80%',
                  backgroundColor: '#EDEDED',
                  marginBottom: '5%',
                  marginVertical: 30
                }}

                onSelect={ async (selectedItem, index) => {
                  if(selectedItem == 'Does not repeat'){
                    await this.setState({repeat: '0'})
                  }
                  if(selectedItem == 'Repeat every 15 minutes'){
                    await this.setState({repeat: 'minutes-15'})
                  }
                  if(selectedItem == 'Repeat every 30 minutes'){
                    await this.setState({repeat: 'minutes-30'})
                  }
                  if(selectedItem == 'Repeat every hour'){
                    await this.setState({repeat: 'hours-1'})
                  }
                  if(selectedItem == 'Repeat every 2 hour'){
                    await this.setState({repeat: 'hours-2'})
                  }
                  if(selectedItem == 'Repeat every 6 hour'){
                    await this.setState({repeat: 'hours-6'})
                  }
                  if(selectedItem == 'Repeat every day'){
                    await this.setState({repeat: 'days-1'})
                  }
                  if(selectedItem == 'Repeat every week'){
                    await this.setState({repeat: 'weeks-1'})
                  }
                }}
              
              />
              <View style={styles.textInput}>
                <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                  <Text>{this.state.dob}</Text>
                  {this.state.showDatePicker  &&
                  <DateTimePicker
                      testID="datePicker"
                      value={new Date}
                      mode={'date'}
                      minimumDate={new Date}
                      is24Hour={false}
                      display='calendar'
                      onChange={(event, selectedDate) => {
                          this.setState({ 
                            dob:moment(selectedDate).format("YYYY-MM-DD"),
                            showDatePicker:false,
                          })
                      }}
                    />
                  }
                </TouchableOpacity>
              </View>
              <View style={styles.textInput}>
                <TouchableOpacity onPress={() => this.setState({ showTimePicker: true })}>
                  <Text>{this.state.time}</Text>
                  {this.state.showTimePicker  &&
                  <DateTimePicker
                      testID="TimePicker"
                      value={new Date}
                      mode={'time'}
                      minimumDate={new Date}
                      is24Hour={false}
                      display='clock'
                      onChange={(event, selectedDate) => {
                          this.setState({ 
                            time:moment(selectedDate).format('LT'),
                            showTimePicker:false
                          })
                      }}
                    />
                  }
                </TouchableOpacity>
              </View>
              <View style = {styles.btnContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => this.closeModall(false)}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity disabled = {this.checkValues()} style={styles.cancelButton} onPress={this.RemindLater}>
                  <Text>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    longPress: state.messages.longPress,
    remindModalState: state.stateHandler.remindModalState
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RemindMeModel);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalView: {
    backgroundColor: 'white',
    width: '95%',
    height: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusButton: {
    flexDirection: 'row',
  },

  btnContainer: {
    marginVertical: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  cancelButton: {
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    elevation:5,
    borderRadius:5,
    marginHorizontal: 10,
    width: 100
  },
  
  modalOpacityView: {
    backgroundColor: 'black',
    opacity: 0.8,
  },

  textInput: {
    width: '80%',
    padding: 10,
    backgroundColor: '#ededed',
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
