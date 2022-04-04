import React, { Component } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

//Redux
import { setAuthUser, setStickers } from "../../store/actions";
import { connect } from "react-redux";

//Component
import MessageActionHeader from "../../components/headers/MessageActionHeader";
import NoItemCard from "../../components/NoItemCard";

class NotificationList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ApiLoader: true,
      reponselater: [],
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <MessageActionHeader navProps={this.props} screen="NotificationList" />
        {this.state.reponselater && this.state.reponselater.length > 0 ? (
          <ScrollView style={styles.responseMainView}></ScrollView>
        ) : (
          <NoItemCard
            icon="alarm-outline"
            msg="You currenlty have no notification."
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    theme: state.theme.theme,
    user: state.auth.user,
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

export default connect(mapStateToProps, mapDispatchToProps)(NotificationList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dbdbdb",
  },
  cardDesign: {
    padding: "5%",
  },
  Loader_container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 700,
  },
  header: {
    justifyContent: "space-between",
    marginTop: "2%",
    backgroundColor: "#008069",
  },
  responseMainView: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.2)",
    margin: 5,
    marginTop: 10,
  },
  responseInnerView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  senderNameAndReceiverView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  senderReciverImage: {
    width: 20,
    height: 20,
  },
  senderRevicerText: {
    marginHorizontal: 5,
    color: "grey",
    fontWeight: "500",
  },
  Icon: {
    backgroundColor: "skyblue",
    padding: 2,
  },
  youText: {
    marginHorizontal: 5,
    color: "grey",
    fontWeight: "500",
  },
  responseMessage: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    marginVertical: "4%",
    padding: 5,
    minWidth: 80,
    borderRadius: 5,
    marginLeft: "2%",
  },
  starAndTime: {
    flexDirection: "row",
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  starIcon: {
    marginHorizontal: 5,
    marginTop: 2,
  },
  responseMessageText: {
    fontSize: 12,
  },
  responseMessagetime: {
    fontSize: 10,
  },
});
