import React, {Component} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

//Socket
import io from "socket.io-client";

//redux
import {connect} from 'react-redux';
import {setAuthUser} from '../store/actions';

//Service
import UserService from '../services/UserService';
class BottomPopup extends Component {
  state = {
    modalVisible: this.props.openModal,
  };
  closeModal = () => {
    this.props.closeBottomModel();
  };
  StatusOption = (status) => {
    let token = this.props.user?.token;
    let payload = {
      new_status: status,
    };
    UserService.UpdateuserStautus(payload,token).then((res) => {
      if (res.data.data.success == "true") {
        let socket = io("https://www.srplivehelp.com:2020", {
          transports: ["websocket"],
        });
        socket.on("connect", () => {
          socket.emit(
            "new_user",
            JSON.stringify({
              user_id: this.props.user?.user.id,
              device: "mobile",
            })
          );
        });
      }
    })
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.openModal}
          onRequestClose={() => {
            this.closeModal();
          }}>
          <View style={styles.centeredView}>
            <TouchableOpacity
              onPress={() => this.closeModal()}
              style={styles.modalOpacityView}
            />
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.statusButton}
              onPress={() => this.StatusOption(1)}
              >
                <View style={styles.OnlineOfflineView} />
                <Text style={{fontSize: 16}}>Online</Text>
              </TouchableOpacity>
              <View style={{borderWidth: 1, borderColor: '#FAFAFA'}} />
              <TouchableOpacity style={styles.statusButton}
              onPress={() => this.StatusOption(2)}>
                <View style={[styles.OnlineOfflineView,{backgroundColor:'grey'}]} />
                <Text style={{fontSize: 16}}>Offline</Text>
              </TouchableOpacity>
              <View style={{borderWidth: 1, borderColor: '#FAFAFA'}} />
              <TouchableOpacity style={styles.statusButton}
              onPress={() => this.StatusOption(3)}
              >
                <View
                  style={styles.busyAndawayView}
                />
                <Text style={{fontSize: 16}}>Busy</Text>
              </TouchableOpacity>
              <View style={{borderWidth: 1, borderColor: '#FAFAFA'}} />
              <TouchableOpacity style={styles.statusButton}
              onPress={() => this.StatusOption(4)}>
                <View
                  style={[styles.busyAndawayView,{backgroundColor:'orange'}]}
                />
                <Text style={{fontSize: 16}}>Away</Text>
              </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => this.closeModal()}>
            <Text>Cancel</Text>
          </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => {
  return {
    theme: state.auth.theme,
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

export default connect(mapStateToProps, mapDispatchToProps)(BottomPopup);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    // shadowRadius: 4,
  },
  statusButton: {
    flexDirection: 'row',
    padding: 12,
    alignSelf: 'center',
  },
  cancelButton: {
    backgroundColor: 'white',
    padding: 12,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom:1,
    elevation:5,
    borderRadius:5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalOpacityView: {
    flex: 1,
    backgroundColor: 'grey',
    opacity: 0.8,
    borderRadius: 10
  },
  OnlineOfflineView: {
    width: 20,
    height: 20,
    backgroundColor: 'green',
    borderRadius: 20 / 2,
    marginRight: 5,
  },
  busyAndawayView:{
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 20 / 2,
    marginRight: 5,
    marginLeft: -10,
  }
});

