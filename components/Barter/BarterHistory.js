import React from 'react';
import { AppLoading } from 'expo';
import { Container, Header, Content, Footer,Button,Label,Item,FooterTab, Icon, Text, Badge,Tabs,Form,Input,Body,Textarea,Card,Left, CardItem, Thumbnail, } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View,Image,ScrollView,AsyncStorage,TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ServerRequest from '../ServerRequest.js';
import * as Permissions from 'expo-permissions';

import AppHeader from '../AppHeader';
var barters = [];
function viewProfile(toState,barterName){
    toState.props.navigation.navigate('Детали бартера',{barterName:barterName})
}
function Barters(props){  
  let output = [];
  for(var i =0; i < props.data.length;i++){
    let userPoint = props.data[i].barterName;
    if(props.data[i].photo != null){      
      output[i] = (
        <TouchableHighlight onPress={function(){viewProfile(props.objectData,this.children.key)} }>
              <Card key={props.data[i].barterName}>
                <CardItem>
                  <Left>
                    <Thumbnail source={{uri: props.data[i].photo}} />
                    <Body>
                      <Text>{props.data[i].name} {props.data[i].lastname} ({props.data[i].login})</Text>
                      <Text note>{userPoint}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
            </TouchableHighlight> 
        )
    }
    else{
      output[i] = (         
            <TouchableHighlight onPress={function(){viewProfile(props.objectData,this.children.key)} }>
              <Card key={props.data[i].barterName}>
                <CardItem>
                  <Left>
                    <Thumbnail source={require('../../ProfilePhoto.jpg')} />
                    <Body>
                      <Text>{props.data[i].name} {props.data[i].lastname} ({props.data[i].login})</Text>
                      <Text note>{userPoint}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
            </TouchableHighlight>         
      )
    }    
  }  
  return(
    <View>{output}</View>    
  );
}

export default class BarterHistory extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      accesKey:'',
      accesGranted:'',
    }
   }   
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
      ServerRequest('getBarterHistory',{accessKey:toState.state.accesKey}).then(function(response){
        barters = response;  
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
      return (
       <View style={styles.header}>
          <View style={styles.contentView}>
              <Container>
              <Content>
                <Barters objectData={this} data={barters} />
              </Content>
            </Container>
            </View>
          <AppHeader style={styles.navigationBar} navigation={this.props.navigation}></AppHeader>
        </View>
      );                  
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