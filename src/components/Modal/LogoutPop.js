import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';

//redux
import { connect } from 'react-redux';
import { LogoutQueries } from '../../database/services/Services';
import { setAuthUser } from '../../store/actions';
import AsyncStorage from '@react-native-community/async-storage';
import UserService from '../../services/UserService';

class LogoutOut extends Component {
  state = {
    modalVisible: this.props.openLogoutModal,
  };
  closeModal = async () => {
    let token = await AsyncStorage.getItem('fcmToken');
    let device = this.props.user.device
    let authToken = this.props.user.token
    UserService.deletePushToken({token, device}, authToken)
    .then(res => {
      let tableName = 'logout_time_table'
      let userId = this.props.user.user.id
      let logoutTime = moment.utc().zone('+0300').format('YYYY-MM-DD HH:mm:ss');
      LogoutQueries.insertAndUpdateLogoutList({tableName, userId, logoutTime}, res => {
        this.props.onSetAuthUser(null)
        this.props.closeLogoutModel();
      })
    })
  };

  render() {
    const { modalVisible } = this.state;
    return (
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.openLogoutModal}
          onRequestClose={() => {
            this.closeModal()
          }}
        >
          <View style={{
            alignSelf: 'center', justifyContent: 'center',
            backgroundColor: 'grey', width: '100%', height: '100%', flex: 1, opacity: 0.95
          }}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Are You Sure</Text>
              <Text style={styles.modalText}>You want to Logout?</Text>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => this.props.closeLogoutModel()}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => this.closeModal()}
                >
                  <Text style={styles.textStyle}>Logout</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>

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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LogoutOut);

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    marginHorizontal: '5%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    // alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    alignSelf: 'center',
    marginHorizontal: 5

  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center"
  }


});

