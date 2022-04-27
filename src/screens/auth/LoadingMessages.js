import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import RNRestart from "react-native-restart";
import ProgressCircle from "react-native-progress-circle";
import FontAwesome5 from "react-native-vector-icons/dist/FontAwesome5";

//Redux
import { setAuthUser, setStickers } from "../../store/actions";
import { connect } from "react-redux";

//Services
import ChatServices from "../../services/ChatServices";

//DataBase
import {
  MessagesQuieries,
  ChatUsersQuieries,
  LogoutQueries,
} from "../../database/services/Services";

class LoadingMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authData: props.route.params.token,
      progress: 0,
      steps: [
        {
          text: "Fetching Stickers",
          isCompleted: true,
          isInProgress: false,
        },
        {
          text: "Fetching Messages",
          isCompleted: false,
          isInProgress: true,
        },
        {
          text: "Saving Messages",
          isCompleted: false,
          isInProgress: false,
        },
        {
          text: "Fetching Users",
          isCompleted: false,
          isInProgress: false,
        },
        {
          text: "Saving Users",
          isCompleted: false,
          isInProgress: false,
        },
        {
          text: "Fetching Chat",
          isCompleted: false,
          isInProgress: false,
        },
        {
          text: "Saving Chat",
          isCompleted: false,
          isInProgress: false,
        },
      ],
    };
  }

  componentDidMount = async () => {
    let step = this.state.steps;
    step[0].isInProgress = true;
    this.setState({ steps: step });
    this.getStickers();
  };

  getStickers = () => {
    ChatServices.stickerList(this.state.authData.token).then(async (res) => {
      let step = this.state.steps;
      step[0].isCompleted = true;
      step[0].isInProgress = false;
      step[1].isInProgress = true;

      await this.setState({
        progress: Math.ceil(100 / 7),
        steps: step,
      });

      this.props.onSetStickers(res.data.data.stickers);
    });
    this.localDbMethod();
  };

  localDbMethod = () => {
    ChatUsersQuieries.create("users_list_table");
    LogoutQueries.create("logout_time_table");
    MessagesQuieries.create("messages_list_table");

    let token = this.state.authData.token;
    let payload = {
      after: this.state.authData.user.created_at,
    };

    ChatServices.updatedMessages(payload, token).then(async (res) => {
      let step = this.state.steps;
      step[1].isCompleted = true;
      step[1].isInProgress = false;
      step[2].isInProgress = true;

      await this.setState({
        progress: Math.ceil(100 / 7) + this.state.progress,
        steps: step,
      });

      let tableName = "messages_list_table";
      let resp = res;
      let onlineUserId = this.state.authData.user.id;

      MessagesQuieries.insertAndUpdateMessageList(
        { tableName, resp, onlineUserId },
        async (res2) => {
          let step = this.state.steps;
          step[2].isCompleted = true;
          step[2].isInProgress = false;
          step[3].isInProgress = true;

          await this.setState({
            progress: Math.ceil(100 / 7) + this.state.progress,
            steps: step,
          });

          this.getUpdateMessageList();
        }
      );
    });
  };

  getUpdateMessageList = () => {
    let token = this.state.authData.token;
    ChatServices.ALLUserList(token).then(async (res, err) => {
      let step = this.state.steps;
      step[3].isCompleted = true;
      step[3].isInProgress = false;
      step[4].isInProgress = true;

      await this.setState({
        progress: Math.ceil(100 / 7) + this.state.progress,
        steps: step,
      });

      let tableName = "users_list_table";
      let data = res.data.data.chat_list;
      let onlineUser = this.state.authData.user.id;
      ChatUsersQuieries.insertAndUpdateUserListonlogin(
        tableName,
        data,
        onlineUser,
        async (res4) => {
          if (res4) {
            let step = this.state.steps;
            step[4].isCompleted = true;
            step[4].isInProgress = false;
            step[5].isInProgress = true;

            await this.setState({
              progress: Math.ceil(100 / 7) + this.state.progress,
              steps: step,
            });
            this.addRecentListToDB();
          }
        }
      );
    });
  };

  addRecentListToDB = () => {
    let user_list_section = "recent";
    let page = 1;
    let token = this.state.authData.token;
    ChatServices.getUserList({ user_list_section, page }, token).then(
      async (res) => {
        let step = this.state.steps;
        step[5].isCompleted = true;
        step[5].isInProgress = false;
        step[6].isInProgress = true;

        await this.setState({
          progress: Math.ceil(100 / 7) + this.state.progress,
          steps: step,
        });
        let tableName = "users_list_table";
        let data = res.data.data.chat_list;
        let onlineUser = this.state.authData.user.id;
        ChatUsersQuieries.insertAndUpdateUserListonlogin(
          tableName,
          data,
          onlineUser,
          async (res2) => {
            let step = this.state.steps;
            step[6].isCompleted = true;
            step[6].isInProgress = false;

            await this.setState({
              progress: 100,
              steps: step,
            });
            this.props.onSetAuthUser(this.state.authData);
            setTimeout(() => {
              RNRestart.Restart();
            }, 100);
          }
        );
      }
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 0.65,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ProgressCircle
              percent={this.state.progress}
              radius={100}
              borderWidth={10}
              color="#42ba96"
              shadowColor="#ddd"
              bgColor="#fff"
            >
              <Text style={{ fontSize: 18 }}>{this.state.progress} %</Text>
            </ProgressCircle>
          </View>

          <View style={{ flex: 1, alignItems: "center" }}>
            {this.state.steps.map((step, index) => {
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: "#fff",
                    borderWidth: 2,
                    borderRadius: 10,
                    borderColor: "#fff",
                    paddingHorizontal: 10,
                    paddingVertical: 15,
                    marginVertical: 5,
                    flexDirection: "row",
                    width: "90%",
                  }}
                >
                  <View style={{ flex: 0.9 }}>
                    <Text
                      style={{
                        width: "80%",
                        color: step.isInProgress ? "#42ba96" : "#000",
                      }}
                    >
                      {step.text}
                    </Text>
                  </View>
                  <View style={{ flex: 0.1 }}>
                    {step.isCompleted ? (
                      <FontAwesome5
                        name={"check"}
                        size={20}
                        color={"#42ba96"}
                        style={{ marginLeft: 15 }}
                      />
                    ) : step.isInProgress ? (
                      <ActivityIndicator
                        size={"small"}
                        color={"#42ba96"}
                        style={{ marginLeft: 15 }}
                      />
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({});

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSetAuthUser: (user) => {
      dispatch(setAuthUser(user));
    },
    onSetStickers: (stickers) => {
      dispatch(setStickers(stickers));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingMessages);
