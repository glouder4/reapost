import React from 'react';
import { AppLoading } from 'expo';
import { Container, Header, Content, Footer,Label,Item,FooterTab, Icon, Text, Badge,Tabs,Form,Input,Body,Textarea,Card,Left, CardItem, Thumbnail, } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View,Image,ScrollView,Button,AsyncStorage,TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ServerRequest from '../ServerRequest.js';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import styles from '../Styles.js';
import AppHeader from '../AppHeader';

var BarterList = [];

function viewBarterDetail(toState,barterName){
  toState.props.navigation.navigate('Детали бартера',{barterName:barterName})
}

function Barters(props){  
  let output = [];
  for(var i =0; i < props.data.length;i++){
    console.log(props.data[i]);
    if(props.data[i].photo != null){      
      output[i] = (
        <TouchableHighlight onPress={function(){viewBarterDetail(props.objectData,this.children.key)} }>
              <Card key={props.data[i].barterName}>
                <CardItem>
                  <Left>
                    <Thumbnail source={{uri: props.data[i].photo}} />
                    <Body>
                      <Text>{props.data[i].name} {props.data[i].lastname} ({props.data[i].username})</Text>
                      <Text note>{props.data[i].barterName}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
            </TouchableHighlight> 
        )
    }
    else{
      output[i] = (         
            <TouchableHighlight onPress={function(){viewBarterDetail(props.objectData,this.children.key)} }>
              <Card key={props.data[i].barterName}>
                <CardItem>
                  <Left>
                    <Thumbnail source={require('../../ProfilePhoto.jpg')} />
                    <Body>
                      <Text>{props.data[i].name} {props.data[i].lastname} ({props.data[i].username})</Text>
                      <Text note>{props.data[i].barterName}</Text>
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

export default class BarterPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      accesKey:'',
      accesGranted:'',
      id:'',
      listEmpty:false
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
      ServerRequest('getMyBarters',{accessKey:this.state.accesKey}).then(function(response){
        if(response.data != 'empty'){
          BarterList = response.data;
          toState.setState({accesGranted:true})
        }  
        else{
          toState.setState({listEmpty:true})          
        }  
      }).catch(function (error) {
        toState.setState({accesGranted:true})
        toState.setState({listEmpty:true})
      }); 
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
      if(this.state.listEmpty == false){
        return (
          <View style={styles.header}>
            <View style={styles.contentView}>
              <Container>
              <Content>
                <Barters objectData={this} data={BarterList} />
              </Content>
            </Container>
            </View> 
            <AppHeader style={styles.navigationBar} navigation={this.props.navigation}></AppHeader>
          </View>
        ); 
      }    
      else{
        return (  
          <View style={styles.header}>
            <View style={styles.contentView}>
              <View style={{height:250,marginTop:100}}>
               <Text style={styles.AboutViewQuestion}>Здесь пока пусто</Text>
               <Text style={styles.projectDescription}>Просмотрите анкеты, быть может ваша идея кому-то понравится</Text>
              </View>
            </View> 
            <AppHeader style={styles.navigationBar} navigation={this.props.navigation}></AppHeader>
          </View>
        )
      }                   
    }
    else{
      return (
         <View></View>
       );
    }
  }  
}