import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import appConfig from '../../../utils/appConfig';

//Redux
import {
  setSearchQuery,
  setSearchState,
  setSearchShow,
} from '../../../store/actions';
import { connect } from 'react-redux';

class USerSearcLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTyping: false,
      searchResponse: null,
      searchLoading: false,
      pageNum: 1,
      searchUserList: undefined,
      searchMessageList: undefined,
    };
  }
  onSearchClick = (res) => {
    this.props.callBackToState()
    this.props.navProps.navigation.navigate('MessageScreen', {
      selectedUser: res,
      screen: 'seacrgTab'
    })
  }

  render() {
    return (
      this.props?.searchuserlistCom.length > 0 ?
        <View>
          <Text style={styles.UserText}>Users</Text>
          {this.props?.searchuserlistCom?.map(res => {
            return (
              <>
                <TouchableOpacity style={styles.userInnerView}
                  onPress={() => this.onSearchClick(res)}
                >
                  {res.avatar === null ? (
                    <FastImage
                      source={require('../../../assets/deafultimage.png')}
                      style={styles.profileImage}
                    />
                  ) : (
                    <FastImage
                      source={{ uri: appConfig.avatarPath + res.avatar }}
                      style={styles.profileImage}
                    />
                  )}
                  <View style={styles.userNameandCompanyView}>
                    <Text style={styles.UserNameText}>
                      {res?.chat_name}
                    </Text>
                    <Text style={styles.CompanyText}>
                      {res?.user_departments}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.borderLine}></View>
              </>
            );
          })}
        </View>
        : this.props.messageUserList !== null &&
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 20}}>No User Found</Text>
        </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    theme: state.theme.theme,
    user: state.auth.user,
    searchQuery: state.stateHandler.searchQuery,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetSearchQuery: data => {
      dispatch(setSearchQuery(data));
    },
    onSetSearchState: data => {
      dispatch(setSearchState(data));
    },
    onSetSearchShow: data => {
      dispatch(setSearchShow(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(USerSearcLists);

const styles = StyleSheet.create({
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
  },
  UserText: {
    fontSize: 17,
    backgroundColor: '#E5E5E5',
    paddingLeft: '5%',
    padding: '1.3%',
    fontFamily: 'Roboto-Bold',
    marginBottom: '1%',
  },
  userInnerView: {
    flexDirection: 'row',
    paddingLeft: '5%',
    marginBottom: '1%',
  },
  userNameandCompanyView: {
    marginLeft: '2%',
    marginTop: '1%',
  },
  UserNameText: {
    fontSize: 17,
    fontFamily: 'Roboto-Regular',
    marginBottom: '3%',
  },
  CompanyText: {
    fontSize: 12,
    color: '#878787',
    width: '80%'
  },
  borderLine: {
    borderWidth: Platform.OS == 'android' ? 0.2 : 0.7,
    borderColor: '#ebebeb',
    width: '100%',
    marginLeft: '5%',
    marginVertical: '2%',
  },
});
