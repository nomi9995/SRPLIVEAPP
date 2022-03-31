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

class FilterModal extends Component {
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
    if(dob !== '00-00-00' && time !== '00:00:00' ) {
        return false
    } else {
        return true
    }
}



SearchMessage = () => {
  
   
   let onlineUser = this.props.user?.user.id;
    let chatUser = this.props.selectedUser.user_id;
    let firstdate =  this.state.dob+" "+'01:00:00'
    let seconddate = this.state.time+" "+'60:00:00'
    MessagesQuieries.filterMsgDb({chatUser, onlineUser, firstdate,seconddate}, res => {
      this.closeModall(false)
      this.props.filterMessageData(res)
    });
   
}




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
                <Text style = {{padding: 10, fontSize: 24, fontWeight: 'bold'}}>Pick a Date To Search Message </Text>
              </View>
              <View style = {{borderBottomColor: 'lightgrey', borderBottomWidth: 1, width: '100%'}} />
              <View style={styles.textInput}>
                <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                  <Text>{this.state.dob}</Text>
                  {this.state.showDatePicker  &&
                  <DateTimePicker
                      testID="datePicker"
                      value={new Date}
                      mode={'date'}
                      maximumDate={new Date}
                      is24Hour={false}
                      display='default'
                      style={{color:'black',width:100}}
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
                      mode={'date'}
                      maximumDate={new Date}
                      is24Hour={false}
                      display='default'
                      onChange={(event, selectedDate) => {
                          this.setState({ 
                            time:moment(selectedDate).format("YYYY-MM-DD"),
                            showTimePicker:false
                          })
                      }}
                      style={{color:'black',width:100}}
                    />
                  }
                </TouchableOpacity>
              </View>
              <View style = {styles.btnContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => this.closeModall(false)}>
                  <Text>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity disabled = {this.checkValues()} style={styles.cancelButton} onPress={() => this.SearchMessage()}>
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

export default connect(mapStateToProps, mapDispatchToProps)(FilterModal);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#777777',
  },

  modalView: {
    backgroundColor: 'white',
    width: '95%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    opacity:1
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
    // height:'40%',
    padding: 10,
    backgroundColor: '#ededed',
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
