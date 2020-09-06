import React from 'react';
import { Container,Content, Text, Card,Left, CardItem,Body, Thumbnail, } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { View,AsyncStorage,TouchableHighlight } from 'react-native';
import ServerRequest from '../ServerRequest.js';

import styles from '../Styles.js';
import AppHeader from '../AppHeader';
var chats = [];
function viewProfile(toState,id){
    toState.props.navigation.navigate('Сообщения пользователя',{userID:id})
}

function Chats(props){  
  let output = [];
  for(var i =0; i < props.length;i++){
    let userPoint = '';
    if(props[i].myPoint != null){
      if(props[i].myPoint == "talk") userPoint = "Общения";
      if(props[i].myPoint == "searchInvest") userPoint = "Найти инвестиции";
      if(props[i].myPoint == "invest") userPoint = "Инвестор";
      if(props[i].myPoint == "instagram") userPoint = "Подписчики";
    } 
    else userPoint = "Не указано";
    if(props[i].photo != null){      
      output[i] = (
        <TouchableHighlight onPress={function(){viewProfile(props.objectData,this.children.key)} }>
              <Card key={props[i].id}>
                <CardItem>
                  <Left>
                    <Thumbnail source={{uri: props[i].photo}} />
                    <Body>
                      <Text>{props[i].name} {props[i].lastname} ({props[i].login})</Text>
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
              <Card key={props[i].id}>
                <CardItem>
                  <Left>
                    <Thumbnail source={require('../../ProfilePhoto.jpg')} />
                    <Body>
                      <Text>{props[i].name} {props[i].lastname} ({props[i].login})</Text>
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

export default class Chat extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      accesKey:'',
      accesGranted:'',
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
      ServerRequest('getChatFeed',{accesKey:toState.state.accesKey}).then(function(response){
        if(response != 'empty'){
          console.log(response);
          chats = response;          
        }  
        else{
          toState.setState({listEmpty:true})          
        }          
        toState.setState({accesGranted:true}) 
      }).catch(function(err){
        console.log(99,err);
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
                  <Chats objectData={this} data={chats} />
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
         );
      }
    }  
}