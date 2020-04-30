import React from 'react';
import { AppLoading } from 'expo';
import { Container, Text } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { StyleSheet, Button,View,Image,ScrollView,AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Post from '../Post/Post.js';

import AppHeader from '../AppHeader';
var newsCards = [];

export default class Newsfeed extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      text:"make posts",
      Posts:{},
      loading: true,
      username:'',
      accesKey:'',
      name:'',
      lastname:'',
      accesGranted:''
    };
    let Body = this;
	    axios.post('http://192.168.0.104:3000/getNewsfeed',JSON.stringify(this.state.username)).then(function (response) {
        console.log(response);
	    }).catch(function (error) {
	      console.log(error);
	    }); 
  }  
  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })
    this.setState({ loading: false })
    const value = await AsyncStorage.getItem('accesKey');
    console.log(value);
    if (value !== null) {
      this.setState({accesKey:value})
      this.setState({accesGranted:true})
    }
    else{
      this.props.navigation.navigate('StartScreen')
    } 
  }
  render(){
  	if (this.state.loading) {
     return (
       <View></View>
     );
   }  	
   else{
   	if(this.state.accesGranted == true){
	  	if(this.state.Posts[1] != undefined){	
			return (
				<View style={styles.header}>
			    	<ScrollView style={styles.header} showsVerticalScrollIndicator={false}>
				        123				        
				    </ScrollView>	
				    <AppHeader navigation={this.props.navigation}></AppHeader>   
			    </View>        
		    )		
	  	}else{
	  		return (  
	  			<View style={styles.header}>
			      <View style={styles.contentView}>
			       <Text>{this.state.text}3123123</Text>
			        <Button onPress={this._postData} title="post data"></Button>
			      </View> 
			      <AppHeader navigation={this.props.navigation}></AppHeader>
			    </View>
		    )
	  	} 
	  }
  	else{
    return (
       <View>
         <Text>ошибка</Text>
       </View>
     );
      }  
  	}      
  }  
}
const styles = StyleSheet.create({
  FirstTitle:{
    fontSize:20,
    textAlign:'center',
    marginTop:'20%'
  },
  contentView:{
    height:'95%'
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
  },
  appHeader:{
    zIndex:1,
    height:'4%',
  }
});