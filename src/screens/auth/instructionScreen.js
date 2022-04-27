import React from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import { W_WIDTH } from "../../utils/regex";
import { GRAY, White } from "../../themes/constantColors";
import { connect } from "react-redux";
import FastImage from "react-native-fast-image";

const InstructionScreen = (props) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: props.theme.container.backgroundColor },
      ]}
    >
      <View style={styles.textView}>
        <Text style={styles.guideText}>Simple, Secure.</Text>
        <Text style={styles.guideText}>Reliable messaging.</Text>
      </View>
      <View style={styles.buttonView}>
        <TouchableOpacity
          onPress={() => props.navigation.replace("LoginScreen")}
        >
          <View style={styles.getStartedView}>
            <Text style={styles.getStartedText}>Get Started</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.logoView}>
        <FastImage
          source={require("../../assets/srp.png")}
          style={{ width: 200, height: 150 }}
          resizeMode={"contain"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoView: {
    position: "absolute",
    top: 100,
    left: 0,
    right: 0,
    height: 180,
    alignItems: "center",
  },
  guideText: {
    textAlign: "left",
    // fontFamily: AppFonts.UbuntuL,
    fontSize: 22,
    color: GRAY,
    width: 220,
    fontFamily: "Roboto-Regular",
  },
  textView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonView: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    height: 180,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
  },
  getStartedView: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 23,
    height: 46,
    width: W_WIDTH - 40,
    backgroundColor: "#008069",
  },
  getStartedText: {
    // fontFamily: AppFonts.UbuntuL,
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    color: White,
  },
  loginView: {
    marginTop: 45,
    flexDirection: "row",
  },
  loginText: {
    // fontFamily: AppFonts.UbuntuL,
    fontFamily: "Roboto-Regular",
    fontSize: 14,
  },
});

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(InstructionScreen);
