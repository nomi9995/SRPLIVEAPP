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

class changePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword:'',
      newpassword:'',
      confirmpassword:''
    };
  }
  changePassword = () => {
    if(this.state.currentPassword == '' || this.state.newpassword == '' || this.state.confirmpassword == '' ){
      Toast.show('Please fill all fileds.', Toast.LONG );
    }
    if (this.state.newpassword !== this.state.confirmpassword){
      Toast.show('Password not matched', Toast.LONG );
    }
    let token = this.props.user?.token;
    let payload ={
      current_password :this.state.currentPassword,
      new_password : this.state.newpassword,
    }
    this.setState({currentPassword:''})
    this.setState({newpassword:''})
    this.setState({confirmpassword:''})
    UserService.changePassword(payload,token).then((res) => {
     
      if(res.data.errors.length > 0){
        Toast.show('Current password not correct', Toast.LONG );
      }else{
        Toast.show('Password changed successfully', Toast.LONG );
      }
      
    })

    Keyboard.dismiss()
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
          <Text style={styles.settingText}>Change Password</Text>
        </View>
        </SafeAreaView>
        <View style={styles.textInputView}>
          <TextInput
            placeholder="Currrent Password"
            placeholderTextColor="#778395"
            style={{padding: 10,marginBottom:5}}
            value={this.state.currentPassword}
            onChangeText={(value) => this.setState({currentPassword:value})}
            secureTextEntry={true}
          />
          <View style={styles.borderLine} />
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#778395"
            style={{marginBottom: 5, padding: 10}}
            value={this.state.newpassword}
            onChangeText={(value) => this.setState({newpassword:value})}
            secureTextEntry={true}
          />
          <View style={styles.borderLine} />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#778395"
            style={{marginBottom: 5, padding: 10}}
            value={this.state.confirmpassword}
            onChangeText={(value) => this.setState({confirmpassword:value})}
            secureTextEntry={true}
          />
          {/* <View style={styles.borderLine} /> */}
        </View>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={()=> this.changePassword()}
          >
          <Text style={{color: 'white', fontSize: 16, fontWeight: '500'}}>
            Save
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

export default connect(mapStateToProps, mapDispatchToProps)(changePassword);

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
    borderWidth: 0.3,
    backgroundColor: 'lightgrey',
  },
  saveButton:{
    backgroundColor: '#283b5b',
    padding: 20,
    alignItems: 'center',
    margin: 10,
  }
});
