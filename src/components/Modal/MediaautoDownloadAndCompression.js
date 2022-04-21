import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import UserService from "../../services/UserService";

//redux
import { connect } from "react-redux";
import { setCompressionQuality } from "../../store/actions";

class MediaautoDownloadAndCompression extends Component {
  state = {
    modalVisible: this.props.openModal,
  };

  closeModal = () => {
    this.props.closeBottomModel();
  };

  CompressionData = (data) => {
    this.props.onSetCompressionQuality(data);
    // let token = this.props.authToken;
    // let payload = {
    //   compression: data,
    // };
    // UserService.compressionImage(payload, token).then((res) => {
    //   this.props.CompressionData(data);
    // });
  };

  render() {
    const { modalVisible } = this.state;
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.openModal}
          onRequestClose={() => {
            this.closeModal();
          }}
        >
          <View style={styles.centeredView}>
            <TouchableOpacity
              onPress={() => this.closeModal()}
              style={styles.modalOpacityView}
            />
            <View style={styles.modalView}>
              {this.props.compressionsetting ? (
                <>
                  <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => this.CompressionData("low")}
                  >
                    <Text style={{ fontSize: 16 }}>Low</Text>
                  </TouchableOpacity>
                  <View style={styles.bottomLine} />
                  <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => this.CompressionData("medium")}
                  >
                    <Text style={{ fontSize: 16 }}>Medium</Text>
                  </TouchableOpacity>
                  <View style={styles.bottomLine} />
                  <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => this.CompressionData("high")}
                  >
                    <Text style={{ fontSize: 16 }}>High</Text>
                  </TouchableOpacity>
                  <View style={styles.bottomLine} />
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => this.props.setdownload("Always")}
                  >
                    <Text style={{ fontSize: 16 }}>Always</Text>
                  </TouchableOpacity>
                  <View style={styles.bottomLine} />
                  <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => this.props.setdownload("Wifi")}
                  >
                    <Text style={{ fontSize: 16 }}>Wifi</Text>
                  </TouchableOpacity>
                  <View style={styles.bottomLine} />
                  <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => this.props.setdownload("Mobile Data")}
                  >
                    <Text style={{ fontSize: 16 }}>Mobile Data</Text>
                  </TouchableOpacity>
                  <View style={styles.bottomLine} />
                  <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => this.props.setdownload("Never")}
                  >
                    <Text style={{ fontSize: 16 }}>Never</Text>
                  </TouchableOpacity>
                  <View style={styles.bottomLine} />
                </>
              )}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => this.closeModal()}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetCompressionQuality: (quality) => {
      dispatch(setCompressionQuality(quality));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MediaautoDownloadAndCompression);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  statusButton: {
    flexDirection: "row",
    padding: 12,
    alignSelf: "center",
  },
  cancelButton: {
    backgroundColor: "white",
    padding: 12,
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 1,
    elevation: 5,
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  modalOpacityView: {
    flex: 1,
    backgroundColor: "grey",
    opacity: 0.9,
    borderRadius: 10,
  },

  bottomLine: {
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
  },
});
