import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/dist/Feather";
import Ionicons from "react-native-vector-icons/dist/Ionicons";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5";
import Icon from "react-native-vector-icons/dist/MaterialCommunityIcons";

import { W_WIDTH } from "../utils/regex";

import FilterModal from "./Modal/FilterModal";
import RemindMeModel from "./Modal/RemindMeModel";

class StatusPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ width: W_WIDTH / 1.75, backgroundColor: "white" }}>
        <>
          <View>
            <TouchableOpacity
              style={styles.popButton}
              onPress={() => {
                this.props.callClose();
                alert("delete");
              }}
            >
              <View style={styles.iconContainer}>
                <FontAwesome5 name="trash" size={20} color="#c2c2c2" />
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.popTitleText} numberOfLines={1}>
                  Delete
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      </View>
    );
  }
}

export default StatusPopup;

const styles = StyleSheet.create({
  popButton: {
    paddingHorizontal: 0,
    paddingVertical: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginVertical: 1,
  },

  iconContainer: {
    flex: 0.2,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
  },

  textContainer: {
    flex: 0.8,
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 3,
  },

  popTitleText: {
    // fontFamily: AppFonts.RobotoRegular,
    fontSize: 16,
    fontWeight: "600",
    textAlignVertical: "center",
    color: "grey",
    fontFamily: "Roboto-Regular",
  },
});
