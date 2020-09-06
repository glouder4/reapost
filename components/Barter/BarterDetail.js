import React from 'react';
import { AppLoading } from 'expo';
import { Container, Header, Content, Footer,Button,Label,Item,FooterTab, Icon, Text, Badge,Tabs,Form,Input,Body,Textarea,Card,Left, CardItem, Thumbnail, } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View,Image,ScrollView,AsyncStorage,TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ServerRequest from '../ServerRequest.js';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import AppHeader from '../AppHeader';

export default class BarterDetail extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      accesKey:'',
      accesGranted:'',
      barterName:'',
      barterData:'',
      status:''
    }
   }   
  barterAccept = async () => {
    let toState = this;
    ServerRequest('BarterAccept',{barterName:this.props.route.params.barterName,accessKey:this.state.accesKey}).then(function(response){
      toState.props.navigation.navigate('Профиль')
    })
  };
  barterDecline = async () => {
    let toState = this;
    ServerRequest('BarterDecline',{barterName:this.props.route.params.barterName,accessKey:this.state.accesKey}).then(function(response){
      toState.props.navigation.navigate('Профиль')
    })
  };
  finishBarter = async () => {
    let toState = this;
    ServerRequest('BarterFinish',{barterName:this.props.route.params.barterName,accessKey:this.state.accesKey}).then(function(response){
      toState.props.navigation.navigate('Профиль')
    })
  };
  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })
    this.setState({ loading: true })
    const value = await AsyncStorage.getItem('accesKey');
    if (value !== null) {
      this.setState({accesKey:value})
      let toState = this; 
      ServerRequest('getBarterDetail',{barterName:toState.props.route.params.barterName,accessKey:toState.state.accesKey}).then(function(response){
        toState.setState({barterName:response[0].barterName})
        toState.setState({barterData:response[0].barterData})
        toState.setState({status:response[0].status})
        console.log(toState.state);
        toState.setState({accesGranted:true})
      })    
    }
    else{
      this.props.navigation.navigate('Вход')
    } 
  }
  render(){      
  	if (this.state.loading == false) {
       return (
         <View></View>
       );
     }  	     
    if(this.state.accesGranted == true){
      if(this.state.status == 'created'){
        return (
          <View style={styles.header}>
            <View style={[styles.contentView,{justifyContent: "center"}]}>
              <View style={styles.AboutView}>
                <Text style={styles.AboutViewQuestion}>Предложение</Text>
                <ScrollView>
                  <Text style={[styles.AboutViewQuestion,styles.projectDescription,{marginTop:25}]}>{this.state.barterName}</Text>
                  <Text style={[styles.projectDescription,{marginBottom:25}]}>{this.state.barterData}</Text>
                </ScrollView>              
              </View>
              <View style={{flexDirection: "row",width:"100%",textAlign:"center",justifyContent: "space-between"}}>
                <Button success title="Принять" style={[styles.projectDescription,{width:"40%",color:'white'}]} onPress={this.barterAccept}><Text>Принять</Text></Button>
                <Button danger title="Отклонить" style={[styles.projectDescription,{width:"40%",color:'white'}]}  onPress={this.barterDecline}><Text>Отклонить</Text></Button>
              </View>            
            </View> 
            <AppHeader navigation={this.props.navigation}></AppHeader>
          </View>
        );
      }
      else if(this.state.status == 'completed'){
        return (
          <View style={styles.header}>
            <View style={[styles.contentView,{justifyContent: "center"}]}>
              <View style={styles.AboutView}>
                <Text style={styles.AboutViewQuestion}>Предложение</Text>
                <ScrollView>
                  <Text style={[styles.AboutViewQuestion,styles.projectDescription,{marginTop:25}]}>{this.state.barterName}</Text>
                  <Text style={[styles.projectDescription,{marginBottom:25}]}>{this.state.barterData}</Text>
                </ScrollView>              
              </View>        
            </View> 
            <AppHeader navigation={this.props.navigation}></AppHeader>
          </View>
        );
      } 
      else{
        return (
          <View style={styles.header}>
            <View style={[styles.contentView,{justifyContent: "center"}]}>
              <View style={styles.AboutView}>
                <Text style={styles.AboutViewQuestion}>Предложение</Text>
                <ScrollView>
                  <Text style={[styles.AboutViewQuestion,styles.projectDescription,{marginTop:25}]}>{this.state.barterName}</Text>
                  <Text style={[styles.projectDescription,{marginBottom:25}]}>{this.state.barterData}</Text>
                </ScrollView>              
              </View> 
              <Button success full title="Принять" onPress={this.finishBarter}>
                <Text style={{textAlign:"center",justifyContent: "flex-end",color:"white"}}>Завершить</Text>
              </Button>         
            </View> 
            <AppHeader navigation={this.props.navigation}></AppHeader>
          </View>
        );
      }                      
    }
    else{
      return (
         <View></View>
       );
    }
  }  
}
const styles = StyleSheet.create({  
  projectDescription:{
    marginTop:5,
    textAlign:"center"
  },
  AboutViewQuestion:{
    fontSize: 20,
    color: 'black',
    textAlign:'center',
  },
  AboutView:{
    zIndex:2,
    marginLeft:'2%',
    padding:3,
    height:450
  },
  contentView:{
    height:'95%'
  },
  header:{
    height:'100%',
    width:'100%',
    zIndex:1,
  },
  AboutViewQuestion:{
    fontSize: 20,
    color: 'black',
    textAlign:'center',
  },
  projectDescription:{
    marginTop:5,
    textAlign:"center"
  },
});