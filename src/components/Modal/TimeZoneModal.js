import React, { Component } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5";
import TimeZoneHelper from "../Modal/TimeZoneHelper";

class TimeZoneModal extends Component {
  state = {
    modalVisible: false,
    filterData: [],
    timeZoneData: TimeZoneHelper,
    searchValue: "",
  };

  componentDidMount = () => {
    this.setState({ modalVisible: this.props.modalShow });
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  handleFilter = (values) => {
    const value = values;

    let updatedData = [];
    this.setState({ searchValue: value });
    if (this.state.timeZoneData.length > 0) {
      if (value.length) {
        updatedData = this.state.timeZoneData.filter((item) => {
          const startsWith = item.name
            .toLowerCase()
            .includes(value.toLowerCase());

          const includes = item.name
            .toLowerCase()
            .includes(value.toLowerCase());
          if (startsWith) {
            return startsWith;
          } else if (!startsWith && includes) {
            return includes;
          } else return null;
        });
        this.setState({ filterData: updatedData });
        this.setState({ searchValue: value });
      }
    }
  };

  slectedData = (data) => {
    this.props.onChangeModal(data, true);
  };

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.modalShow}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => this.props.onChangeModal()}
              style={styles.crossIcon}
            >
              <FontAwesome5
                name={"arrow-right"}
                style={{
                  color: "gray",
                  fontSize: 20,
                }}
              />
            </TouchableOpacity>
            <TextInput
              value={this.state.searchValue}
              onChangeText={(value) => this.handleFilter(value)}
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                color: "black",
              }}
              placeholder="Search Time Zone"
              placeholderTextColor="#C5C2C2"
            />
            <ScrollView>
              {this.state.searchValue !== ""
                ? this.state.filterData.map((data) => {
                    return (
                      <TouchableOpacity
                        key={Math.random()}
                        onPress={() => this.slectedData(data.name)}
                      >
                        <Text style={{ padding: "3%" }}>{data.name}</Text>
                      </TouchableOpacity>
                    );
                  })
                : this.state.timeZoneData.map((data) => {
                    return (
                      <TouchableOpacity
                        key={Math.random()}
                        onPress={() => this.slectedData(data.name)}
                      >
                        <Text style={{ padding: "3%" }}>{data.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  modalView: {
    margin: 0,
    backgroundColor: "white",
    shadowColor: "green",
    height: "100%",
    marginTop: "10%",
    padding: "5%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1.25,
    shadowRadius: 4,
    elevation: 10,
  },
  inputLabelFlex: {
    marginTop: "2%",
  },
  inputLabel: {
    fontSize: 18,
    color: "#7B7676",
  },
  label: {
    fontSize: 18,
    color: "#7B7676",
  },
  inputDesign: {
    height: 50,
    width: 300,
    borderRadius: 5,
    marginTop: "2%",
    borderColor: "black",
    borderWidth: 1,
  },
  addBtn: {
    backgroundColor: "#059F82",
    padding: "5%",
    alignItems: "center",
    marginTop: "5%",
    borderRadius: 5,
    width: "100%",
    alignSelf: "center",
  },
  crossIcon: {
    alignSelf: "flex-end",
  },
});

export default TimeZoneModal;
