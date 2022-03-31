import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {connect} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome5';
import UserService from '../../services/UserService'
import Toast from 'react-native-simple-toast';
//Components

//Service

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email:''
    };
  }
  resetPassword = () => {
    let email = this.state.email
    UserService.resetPassword({email},true).then((res) => {
     
      
    })

  }

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{backgroundColor:'#008069'}}>
        <View style={styles.headerview}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => this.props.navigation.goBack()}>
            <FontAwesome name={'arrow-left'} size={20} color={'white'} />
          </TouchableOpacity>
          <Text style={styles.settingText}>Forgot Password</Text>
        </View>
        </SafeAreaView>
        <View style={styles.textInputView}>
          
          
          <TextInput
            placeholder="Enter Email Address"
            placeholderTextColor="#778395"
            style={{marginBottom: 10, padding: 10}}
            value={this.state.email}
            onChangeText={(value) => this.setState({email:value})}
          />
          <View style={styles.borderLine} />
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => this.resetPassword()}
          >
          <Text style={{color: 'white', fontSize: 16, fontWeight: '500'}}>
            Reset Password
          </Text>
        </TouchableOpacity>
      </View>
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerview: {
    backgroundColor: '#008069',
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 5,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 10,
  },
  textInputView: {
    backgroundColor: '#FAFAFA',
    padding: 10,
    margin: 10,
    elevation: 5,
  },
  borderLine: {
    borderWidth: 0.1,
    backgroundColor: 'lightgrey',
  },
  saveButton:{
    backgroundColor: '#283b5b',
    padding: 20,
    alignItems: 'center',
    margin: 10,
  }
});
