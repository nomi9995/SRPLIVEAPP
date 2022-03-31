import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

let ioschangeDate = '';

const dateTimeModal = props => {
  const modelScreenClose = () => {
    props.closeModel(false);
  };
  const saveDate = () => {
    props.onChangeData(ioschangeDate);
    props.closeModel(false);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.openModal && Platform.OS === 'ios'}
      onRequestClose={() => {
        modelScreenClose();
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            onPress={() => {
              modelScreenClose();
            }}
            style={{alignSelf: 'flex-end'}}>
            <Icon name={'times-circle'} size={20} color="grey" />
          </TouchableOpacity>
          <Text style={styles.pickDateText}>Pick a date</Text>
          <DateTimePicker
            testID="dateTimePicker"
            value={moment().toDate()}
            mode="date"
            display="spinner"
            maximumDate={moment().toDate()}
            onChange={date =>
              (ioschangeDate = moment(date.nativeEvent.timestamp).format(
                'YYYY-MM-DD',
              ))
            }
          />
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => saveDate()}>
            <Text style={styles.textStyle}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backImage: {
    height: 20,
    width: 30,
  },
  emailText: {color: '#C5C2C2'},
  profileImage: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 10,

    borderTopRightRadius: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  editText: {
    color: 'white',
  },
  saveBtn: {
    backgroundColor: '#059F82',
    marginBottom: 30,
    paddingLeft: '20%',
    paddingRight: '20%',
    paddingTop: '3%',
    paddingBottom: '3%',
    borderRadius: 50,
    marginBottom: '15%',
  },
  settingText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: '4%',
  },
  outerMostView: {
    backgroundColor: 'white',
    flex: 1,
  },
  genderPicker: {
    width: '100%',
    color: 'black',
  },
  deleteBtn: {
    marginBottom: 12,
    paddingLeft: '10%',
    paddingRight: '10%',
    paddingTop: '3%',
    paddingBottom: '3%',
    borderRadius: 5,
    borderColor: 'red',
    borderWidth: 1,
  },
  formFlex: {
    padding: '3%',
  },
  inputLabelFlex: {
    marginTop: '5%',
  },
  inputLabel: {
    fontSize: 18,
    color: '#7B7676',
    fontWeight: 'bold',
    marginLeft: '3%',
  },
  label: {
    fontSize: 18,
    color: '#7B7676',
    fontWeight: 'bold',
    marginVertical: '2%',
  },
  dateTimePickerStyle: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  inputDesign: {
    height: 50,
    borderRadius: 10,
    marginTop: '2%',
    backgroundColor: '#FAFAFA',
    borderColor: '#E9EBED',
    color: 'black',
    borderWidth: 1,
    marginHorizontal: '4%',
    paddingLeft: '4%',
    color: 'black',
    paddingRight: '4%',
  },
  inputAreaDesign: {
    height: 100,
    borderRadius: 10,
    marginTop: '2%',
    backgroundColor: '#FAFAFA',
    borderColor: '#EDEFF1',
    borderWidth: 1,
    paddingRight: '4%',
    paddingLeft: '4%',
    marginHorizontal: '4%',
    color: 'black',
  },
  inputDesignBirth: {
    borderRadius: 10,
    marginTop: '2%',
    borderColor: '#EAEBED',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,

    marginHorizontal: '4%',
    color: 'black',
  },
  editBtnFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003631',
    padding: '3%',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    justifyContent: 'center',
  },
  mainEditImage: {
    borderRadius: 10,
    borderColor: '#7B7676',
    borderWidth: 1,
  },
  middleFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: '7%',
  },
  profileImage: {
    width: 150,
    height: 120,
    borderTopLeftRadius: 10,

    borderTopRightRadius: 10,
  },
  uploadBtn: {
    padding: '10%',
    borderColor: 'green',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  uploadBtnFlex: {
    paddingTop: '8%',
    paddingBottom: '5%',
    paddingLeft: '10%',
    paddingRight: '10%',
    alignItems: 'center',
    width: '70%',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#059F82',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 22,
  },
  pickDateText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  backbutton: {
    backgroundColor: 'white',
    width: '15%',
    height: '4%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default dateTimeModal;