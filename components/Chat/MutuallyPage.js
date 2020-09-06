import React from 'react';
import { AppLoading } from 'expo';
import { Container, Header, Content, Footer,Label,Item,FooterTab, Icon, Text, Badge,Tabs,Form,Input,Body,Textarea,Card,Left, CardItem, Thumbnail, } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View,Image,ScrollView,Button,AsyncStorage,TouchableHighlight } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import ServerRequest from '../ServerRequest.js';

import AppHeader from '../AppHeader';
import styles from '../Styles.js';
var Mutuallys = [];

function viewProfile(toState,id){
    toState.props.navigation.navigate('Пользователь',{pointId: id, selfId:toState.state.id})
}
function Mutually(props){  
  console.log(props.data);
  let output = [];
  for(var i =0; i < props.data.length;i++){
    let userPoint = '';
    if(props.data[i].userPoint != null){
      if(props.data[i].userPoint == "talk") userPoint = "Общения";
      if(props.data[i].userPoint == "searchInvest") userPoint = "Найти инвестиции";
      if(props.data[i].userPoint == "invest") userPoint = "Инвестор";
      if(props.data[i].userPoint == "instagram") userPoint = "Подписчики";
    } 
    else userPoint = "Не указано";
    if( props.data[i].lastname == 'null' ) props.data[i].lastname = '';
    if(props.data[i].photo != null){      
      output[i] = (
        <TouchableHighlight onPress={function(){viewProfile(props.objectData,this.children.key)} }>
              <Card key={props.data[i].id}>
                <CardItem>
                  <Left>
                    <Thumbnail source={{uri: props.data[i].photo}} />
                    <Body>
                      <Text>{props.data[i].name} {props.data[i].lastname} ({props.data[i].username})</Text>
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
              <Card key={props.data[i].id}>
                <CardItem>
                  <Left>
                    <Thumbnail source={require('../../ProfilePhoto.jpg')} />
                    <Body>
                      <Text>{props.data[i].name} {props.data[i].lastname} ({props.data[i].username})</Text>
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
export default class MutuallyPage extends React.Component{
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
      ServerRequest('getMuttualys',{accesKey:this.state.accesKey}).then(function(response){
        if( response.List[0] != undefined ){
          if(response != 'empty'){
            Mutuallys = response.List;
            toState.setState({id:response.selfID}) 
          }  
          else{
            toState.setState({listEmpty:true})          
          }       
          toState.setState({accesGranted:true}) 
        }  
        else{
          toState.setState({accesGranted:true})
          toState.setState({listEmpty:true})
        }
      }).catch(function (error) {
        toState.setState({accesGranted:true})
        toState.setState({listEmpty:true})
        console.log(39,error);
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
                  <Mutually objectData={this} data={Mutuallys} />
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
              <View style={{height:"90%"}}>
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