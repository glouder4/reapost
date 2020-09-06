import React from 'react';
import { AppLoading } from 'expo';
import { Container,Content,Form,Input,Item,Icon, Text, Card,Left, CardItem,Body, Thumbnail,Button } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View,Image,ScrollView,AsyncStorage,TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ServerRequest from '../ServerRequest.js';
import SocketIOClient from 'socket.io-client';

function viewProfile(toState,id){
  toState.props.navigation.navigate('Пользователь',{pointId: id, selfId:toState.state.selfID})
}

function ChatHeaderTitle(props){
  if(propsObject.state.userChatProfilePhoto == ""){
    return(
      <TouchableOpacity onPress={function(){viewProfile(propsObject,this.children.key)} }>
        <Card key={propsObject.state.userID} transparent style={{width:250}}>
            <CardItem>
                <Left>
                    <Thumbnail style={{width:45,height:45}} source={require('../../ProfilePhoto.jpg')} />
                    <Body>
                      <Text>{propsObject.state.userChatName} {propsObject.state.userChatLastName} {propsObject.state.userChatUsername}</Text>
                      <Text>{propsObject.state.userChatPoint}</Text>
                    </Body>
                </Left>
            </CardItem>
        </Card>
      </TouchableOpacity>
    );
  }else{
    return(
      <TouchableOpacity onPress={function(){viewProfile(propsObject,this.children.key)} }>
        <Card key={propsObject.state.userID} transparent style={{width:250}}>
            <CardItem>
                <Left>
                    <Thumbnail style={{width:45,height:45}} source={{uri: propsObject.state.userChatProfilePhoto}} />
                    <Body>
                      <Text>{propsObject.state.userChatName} {propsObject.state.userChatLastName} {propsObject.state.userChatUsername}</Text>
                      <Text>{propsObject.state.userChatPoint}</Text>
                    </Body>
                </Left>
            </CardItem>
        </Card>
      </TouchableOpacity>
    );
  } 
}

function ChatFeed(props){
  let output = [];  
  for(var i =0; i < props.chat.length;i++){
    if(props.chat[i].side == 1){
      output[i] = (
        <Item bordered rounded style={styles.leftMessage}>
          <Text>{props.chat[i].message}</Text>
        </Item>
      )
    }
    else{
      output[i] = (
        <Item bordered rounded style={styles.rightMessage}>
          <Text>{props.chat[i].message}</Text>
        </Item>
      )
    }
  }
  return(
    <View>{output}</View>
  );
}

function connectMe(toState,selfIF,userID){
	console.log(76,selfIF,userID);
	toState.socket.emit("connect", selfIF,userID);
}

export default class Chat extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      accesKey:'',
      accesGranted:'',
      selfID:'',
      userID: '',
      userChatName:'',
      userChatLastName:'',
      userChatUsername:'',
      userChatProfilePhoto:'',
      userChatPoint:'',
      chatMessage:'',
      chatFeed:[],
      chat_id:''
    }
    this.chatMessage = this.chatMessage.bind(this); 
    this.sendMessage = this.sendMessage.bind(this);

    this.socket = SocketIOClient('http://192.168.0.102:3000');//http://reapost.ufasaduu.ru/

    this.state.chatFeed.push(
      {
        side:1,
        message: 'Сообщение слева Сообщение слева Сообщение слева Сообщение слева Сообщение слева'
      }
    ) 
   }   
	chatMessage(event) {
	    this.setState({chatMessage: event.nativeEvent.text });
	}
	sendMessage(event) {
	    console.log('click');
	    this.socket.emit('message', this.state.chatMessage, this.state.selfID,this.state.userID,this.state.chat_id);
      this.setState({'chatMessage':''})
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
      toState.setState({userID:toState.props.route.params.userID})      
      ServerRequest('getChatUserDetail',{accesKey:toState.state.accesKey,userID:toState.state.userID}).then(function(response){
        toState.setState({selfID:response.selfID})        
        toState.setState({userChatName:response[0].name});
        toState.setState({userChatLastName:response[0].lastname});
        toState.setState({userChatUsername:response[0].login});
        if(response[0].profilePhoto != null) toState.setState({userChatProfilePhoto:response[0].profilePhoto});
        toState.setState({userChatPoint:response[0].myPoint});
        toState.props.navigation.setOptions({
         headerTitle:  props => (<ChatHeaderTitle dataObject={toState} ></ChatHeaderTitle>)
        })                
        console.log(toState.state); 
        toState.socket.emit('ONconnection', toState.state.selfID,toState.state.userID);
      }) 
      this.socket.on("ONconnection", (SelfID,UserID,chatID) => {
        toState.setState({chat_id: chatID})  
      })
      this.socket.on("message", (msg,SelfID,UserID,chatID) => {
        console.log('message',msg,SelfID,UserID,chatID);
        let feed = [];
        for(var i =0; i < this.state.chatFeed.length;i++){
          feed.push({
            side:this.state.chatFeed[i].side,
            message:this.state.chatFeed[i].message,
          })
        }
        if(SelfID == toState.state.selfID){
          feed.push({
            side:2,
            message:msg,
          })
        }
        else{
          feed.push({
            side:1,
            message:msg,
          })
        }
        this.setState({chatFeed: feed}) 
      });
      this.socket.on("ChatID-error", (SelfID,UserID,chatID) => {
        toState.props.navigation.navigate('Вход')
      })

      toState.setState({accesGranted:true})       
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
      if( (this.state.accesGranted == true)&&( this.state.chat_id != '' )&&( this.state.chat_id != undefined ) ){   
        return (   
          <View style={styles.header}>
            <View style={styles.contentView}>
              <ScrollView>
                <ChatFeed dataObject={this.state} chat={this.state.chatFeed} />
              </ScrollView>
            </View>
            <Container style={styles.navigationBar} >
  		        <Content>
  		          <Form style={{alignItems:"center"}}>
  		            <Item style={{width:'95%'}} bordered rounded>
  		              <Input placeholder="Введите сообщение" onChange={this.chatMessage}  />
  		              <Button transparent onPress={ this.sendMessage }><Icon active name='paper-plane' /></Button>
  		            </Item>
  		          </Form>
  		        </Content>
  		    </Container>
          </View>
        );
      }
      else{
        return (
           <View style={styles.header}></View>
         );
      }
    }  
}
const styles = StyleSheet.create({ 
  leftMessage:{
    flexDirection:'row',
    justifyContent:'flex-start',
    marginTop:10,
    marginBottom:5,
    width:'auto',
    maxWidth:'50%',
    alignSelf:'flex-start',
    padding:5
  }, 
  rightMessage:{
    flexDirection:'row',
    justifyContent:'flex-end',
    marginTop:10,
    marginBottom:5,
    width:'auto',
    maxWidth:'50%',
    alignSelf:'flex-end',
    padding:5
  },
  navigationBar:{
    bottom:1,
    width:'100%',    
  },
  contentView:{
    height:'90%'
  },
  header:{
    height:'100%',
    width:'100%',
    zIndex:1,
    flex: 1,
    backgroundColor:'#fff',    
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