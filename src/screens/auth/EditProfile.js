import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import FontAwesome from "react-native-vector-icons/dist/FontAwesome5";
import { ONLINE } from "../../themes/constantColors";
import FastImage from "react-native-fast-image";
import CountryPicker from "react-native-country-picker-modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import DocumentPicker from "react-native-document-picker";
import UserService from "../../services/UserService";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5";
import appConfig from "../../utils/appConfig";

//Component
import DateTimeModal from "../../components/Modal/DatetimePicker";
import TimeZoneModal from "../../components/Modal/TimeZoneModal";

//Redux
import { connect } from "react-redux";
import { setAuthUser } from "../../store/actions";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      countrySelect: false,
      timeZoneModalShow: false,
      first_name: this.props?.route?.params?.user?.first_name,
      last_name: this.props?.route?.params?.user?.last_name,
      country: this.props?.route?.params?.user?.country,
      email: this.props?.route?.params?.user?.email,
      sex: this.props?.route?.params?.user?.sex,
      timezone: this.props?.route?.params?.user?.timezone,
      imageView: this.props?.route?.params?.user?.avatar,
      ImagePicked: "",
      loading: false,
      pickerOpen: false,
      showCalender: false,
      EventDate: this.props?.route?.params?.user?.dob,
    };
  }

  pickImage = async () => {
    let token = this.props.user?.token;
    let userId = this.props?.route?.params?.user?.id;
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.images],
    });
    this.setState({ loading: true });
    let avatar = {
      uri: res[0].uri,
      type: res[0].type,
      name: res[0].name,
    };
    let formdata = new FormData();
    formdata.append("first_name", this.state.first_name);
    formdata.append("last_name", this.state.last_name);
    formdata.append("email", this.state.email);
    formdata.append("timezone", this.state.timezone);
    formdata.append("avatar", avatar);
    fetch("https://www.srplivehelp.com/api/save-profile", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      body: formdata,
    }).then((res) => {
      if (res.status === 200) {
        UserService.getUser({ id: userId }, token).then((res) => {
          let userObj = {
            token: this.props.user?.token,
            user: res.data.data,
          };
          this.props.onSetAuthUser(userObj);
          this.props.navigation.navigate("Profile");
        });
      }
      this.setState({ loading: false });
    });
  };

  updateProfile = () => {
    this.setState({ loading: true });
    let first_name = this.state.first_name;
    let last_name = this.state.last_name;
    let country = this.state.country;
    let email = this.state.email;
    let sex = this.state.sex;
    let dob = this.state.EventDate;
    let timezone = this.state.timezone;
    let token = this.props.user?.token;
    let userId = this.props?.route?.params?.user?.id;
    UserService.userProfileUpdate(
      {
        first_name,
        last_name,
        country,
        email,
        sex,
        dob,
        timezone,
      },
      token
    ).then((res) => {
      if (res.data?.data?.success) {
        UserService.getUser({ id: userId }, token).then((res) => {
          let userObj = {
            token: this.props.user?.token,
            user: res.data.data,
          };
          this.props.onSetAuthUser(userObj);
          Alert.alert("User Upadted!");
          this.setState({ loading: false });
        });
      }
    });
  };
  showIcon = () => {
    return (
      <View style={{ marginTop: 0 }}>
        <FontAwesome5 name={"chevron-down"} size={17} />
      </View>
    );
  };

  onChangeTimezoneModal = (data) => {
    if (data !== null && data !== undefined) {
      this.setState({ timezone: data });
    }
    this.setState({ timeZoneModalShow: false });
  };

  onChangeData = (selectedDate) => {
    console.log("Selected Date", selectedDate);
    this.setState({ showCalender: false });
    this.setState({ EventDate: selectedDate });
  };

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ backgroundColor: "#008069" }}>
          <View style={styles.headerview}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.navigation.replace("Profile")}
            >
              <FontAwesome name={"arrow-left"} size={20} color={"white"} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        <View style={styles.innerView}>
          <View style={styles.profileImageView}>
            {this.state.loading ? (
              <ActivityIndicator color="green" size="large" />
            ) : (
              <View
                style={[
                  styles.profileView,
                  {
                    borderColor: "#fff",
                    marginTop: -15,
                  },
                ]}
              >
                <FastImage
                  style={styles.profileImage}
                  // source={require("../../assets/deafultimage.png")}
                  source={
                    this.props?.route?.params?.user?.avatar === null
                      ? require("../../assets/deafultimage.png")
                      : {
                          uri:
                            appConfig.avatarPath +
                            this.props?.route?.params?.user?.avatar,
                        }
                  }
                />
              </View>
            )}
            <TouchableOpacity
              style={styles.CameraIcon}
              onPress={() => this.pickImage()}
            >
              <FontAwesome name={"camera"} size={20} color={"white"} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 40,
            }}
          >
            <View style={styles.textInput}>
              <Text style={styles.FirstLastnameText}>First Name</Text>
              <View style={styles.textInputComp}>
                <TextInput
                  style={styles.FirstLastNameTestInput}
                  value={this.state.first_name}
                  placeholder="last name"
                  placeholderTextColor={"grey"}
                  onChangeText={(first_name) => this.setState({ first_name })}
                />
              </View>
            </View>

            <View style={styles.textInput}>
              <Text style={styles.FirstLastnameText}>Last Name</Text>
              <View style={styles.textInputComp}>
                <TextInput
                  style={styles.FirstLastNameTestInput}
                  value={this.state.last_name}
                  placeholder="Last name"
                  placeholderTextColor={"grey"}
                  onChangeText={(last_name) => this.setState({ last_name })}
                />
              </View>
            </View>

            <View style={styles.textInput}>
              <Text style={styles.FirstLastnameText}>Email</Text>
              <View style={styles.textInputComp}>
                <TextInput
                  style={styles.FirstLastNameTestInput}
                  value={this.state.email}
                  placeholder="Email"
                  placeholderTextColor={"grey"}
                  keyboardType={"email-address"}
                  onChangeText={(email) => this.setState({ email })}
                />
              </View>
            </View>

            <View style={styles.textInput}>
              <Text style={styles.FirstLastnameText}>Gender</Text>
              <SelectDropdown
                renderDropdownIcon={this.showIcon}
                buttonTextStyle={{ left: 18, marginRight: 270, width: 100 }}
                defaultButtonText={this.state.sex == 0 ? "Male" : "Female"}
                data={["Male", "Female"]}
                buttonStyle={{
                  height: 40,
                  width: "100%",
                  backgroundColor: "#EDEDED",
                  borderRadius: 10,
                }}
                onSelect={async (selectedItem, index) => {
                  await this.setState({ sex: index });
                }}
              />
            </View>

            <View style={styles.textInput}>
              <Text style={styles.FirstLastnameText}>Dob</Text>
              <TouchableOpacity
                style={[styles.textInputComp, styles.CountryPickerStyle]}
                onPress={() => this.setState({ showCalender: true })}
              >
                <Text style={{ color: "black" }}>{this.state.EventDate}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.textInput}>
              <Text style={styles.FirstLastnameText}>Country</Text>
              <TouchableOpacity
                style={[styles.textInputComp, styles.CountryPickerStyle]}
                onPress={() => this.setState({ countrySelect: true })}
              >
                <CountryPicker
                  {...{
                    countryCode: this.state.country,
                    withFilter: true,
                    withFlag: true,
                    withCountryNameButton: true,
                    onSelect: (country) => {
                      this.setState({ country: country.cca2 });
                    },
                  }}
                  visible={this.state.countrySelect}
                  onClose={() => this.setState({ countrySelect: false })}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.textInput}>
              <Text
                style={{
                  color: "grey",
                  fontWeight: "bold",
                  paddingVertical: "3%",
                }}
              >
                Time Zone
              </Text>
              <TouchableOpacity
                style={[styles.textInputComp, styles.CountryPickerStyle]}
                onPress={() => this.setState({ timeZoneModalShow: true })}
              >
                <Text style={{ color: "black" }}>{this.state.timezone}</Text>

                <TimeZoneModal
                  modalShow={this.state.timeZoneModalShow}
                  onChangeModal={(data) => this.onChangeTimezoneModal(data)}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.updateButtonContainer}>
              <TouchableOpacity
                onPress={() => this.updateProfile()}
                style={styles.updateButton}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                  }}
                >
                  Update Profile
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        {/* <DateTimeModal
          openModal={this.state.showCalender}
          closeModel={(val) => this.setState({ showCalender: val })}
          onChangeData={(val) => this.setState({ EventDate: val })}
        /> */}
        {this.state.showCalender && Platform.OS == "android" && (
          <DateTimePicker
            textColor="#eee"
            testID="dateTimePicker"
            value={new Date()}
            mode="date"
            display="spinner"
            maximumDate={moment().toDate()}
            onChange={(date) =>
              this.onChangeData(
                moment(date.nativeEvent.timestamp).format("YYYY-MM-DD")
              )
            }
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    theme: state.auth.theme,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetAuthUser: (user) => {
      dispatch(setAuthUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);

const styles = StyleSheet.create({
  updateButton: {
    width: "40%",

    backgroundColor: "#008069",
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
  },
  updateButtonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginTop: "10%",
  },
  CountryPickerStyle: {
    height: 40,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: "2.5%",
  },
  accountFormView: {
    flex: 1,
    width: "90%",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  innerView: {
    flex: 1,
    padding: 10,
    paddingTop: "10%",
    paddingBottom: 0,
  },
  bottomButton: {
    position: "absolute",
    bottom: 35,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    backgroundColor: ONLINE,
  },
  headerContainer: {
    flex: 1,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
  },
  profileView: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    height: 100,
  },
  nameView: {
    flex: 1,
  },
  nameText: {
    fontSize: 20,
  },
  messageText: {
    marginTop: 4,
    fontSize: 13,
  },

  profileImageView: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    width: "100%",
  },
  CameraIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(51, 182, 208,0.4)",
    borderRadius: 20,
    position: "absolute",
    top: -20,
    right: 120,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  textInput: {
    marginLeft: 10,
    marginRight: 10,
    width: "95%",
  },
  textInputComp: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "lightgrey",
    paddingLeft: 5,
    backgroundColor: "#FAFAFA",
    color: "black",
  },
  FirstLastnameText: {
    color: "black",
    fontWeight: "500",
    paddingVertical: "3%",
  },
  FirstLastNameTestInput: {
    height: 40,
    color: "black",
    paddingLeft: "1%",
  },
  headerview: {
    backgroundColor: "#008069",
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 10,
  },
});
