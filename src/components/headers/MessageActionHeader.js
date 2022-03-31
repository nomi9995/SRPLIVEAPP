import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
export default class MessageActionHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress', this.hardwareBack);
  }

  componentWillUnmount = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.hardwareBack);
  }

  hardwareBack = () => {
    this.props.navProps.navigation.goBack()
    return true;
  };

  render() {
    const { screen } = this.props;

    return (
      <View >
        <View style={styles.headerview}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => this.props.navProps.navigation.goBack()}>
            <FontAwesome name={'arrow-left'} size={20} color={'white'} />
          </TouchableOpacity>
          <Text style={styles.settingText}>
            {screen === "Acknowledgement" || screen === "Favourite" || screen === "NotificationList"
              || screen === "RespondLater" || screen === "StarredList"
              ?
              <>
                {this.props.screen} List
              </>
              : null}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerview: {
    backgroundColor: '#008069',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
  },
  settingText: {
    color: 'white',
    fontSize: 20,
    marginLeft: 10,
  },
});
