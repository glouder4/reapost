import * as React from 'react';
import { StyleSheet, Button,View,Image,ScrollView,AsyncStorage } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label,Text,Footer, FooterTab, Icon, Badge, Tabs } from 'native-base';

const styles = StyleSheet.create({
  FirstTitle:{
  	fontSize:20,
  	textAlign:'center',
  	marginTop:'20%'
  },
  header:{
	  height:'100%',
	  width:'100%',
	  zIndex:1,
  },
  blockContainer:{
  	flex:1,
  	marginTop:0
  },
  smthWrong:{
  	color:'red',
  	borderColor:'red'
  },
  Success:{
  	color:'green',
  	borderColor:'green'
  }
});
export default class StartScreen extends React.Component{
	constructor(props) {
      super(props);
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });    
    this.setState({ loading: false })
    let toState = this;
    const value = await AsyncStorage.getItem('accesKey');
    if (value !== null) {
      this.props.navigation.navigate('Profile',value)
    }
    else{
      toState.setState({accesGranted:'false'})
    }    
  }  
  render(){
  	return (
	    <View style={styles.blockContainer}>
		  <Text style={styles.FirstTitle}>
		    Добро пожаловать в reapost!
		  </Text>
		  <View  style={{marginTop:50}}>
		  	<Button title="Регистрация" onPress={() => this.props.navigation.navigate('SignIn')} />
	    	<Button title="Авторизация" onPress={() => this.props.navigation.navigate('SignUp')} />
		  </View>    
		</View>
	);
  }
}