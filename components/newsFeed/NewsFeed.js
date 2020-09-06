import React,{ Component } from 'react';
import { AppLoading } from 'expo';
import { Container,Button, Header, View, DeckSwiper, Card, CardItem, Thumbnail, Text, Left, Body,Content, Icon } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet,Image,ScrollView,SafeAreaView,AsyncStorage,Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import ServerRequest from '../ServerRequest.js';
import Post from '../Post/Post.js';

import AppHeader from '../AppHeader';
import styles from '../Styles.js';
var newsCards = [];
let deviceHeight = Math.round(Dimensions.get('window').height);

function PointView(data){
  if((data.userData.name != "null")&&(data.userData.name != null)){
    return(
      <View style={[styles.AboutView,{width:'100%',height:200}]}>
        <Text style={[styles.AboutViewQuestion]}>Моя идея</Text>
        <View style={{borderWidth:1,borderColor:"#f2f2f2"}} >
          <Text style={[styles.AboutViewQuestion,styles.projectDescription,{marginTop:25}]}>{data.userData.name}</Text>
          <Text style={[styles.projectDescription,{marginBottom:25}]}>{data.userData.projectData}</Text>
        </View>
      </View>

    );
  }
  else if((data.userData.projectData != null)&&(data.userData.projectData != "null")){
    return(
      <View>
        <Text>{data.userData.projectData}</Text>
      </View>
    );
  }
  else{
    return(
      <View>
        
      </View>
    );
  }
}

function SelfInfo(props){
  let output = [];
  if(props.userData.age != undefined){
    output.push(
      <View style={[styles.SelfView,styles.selfInfo]}>
        <Text>Возраст: </Text>
        <Text>{props.userData.age}</Text>                  
      </View>   
    );
  }
  if(props.userData.point != null){
    output.push(
      <View style={[styles.SelfView,styles.selfInfo]}>
        <Text>Сфера: </Text>
        <Text>{props.userData.point}</Text>                  
      </View>  
    );
    if(props.userData.point == "Больше инстаграм подписчиков"){
      output.push(
        <View style={[styles.SelfView,styles.selfInfo]}>
          <Text>Объем аудитории: </Text>
          <Text>Менее 500</Text>                  
        </View>  
      );
    }
    else if(props.userData.point == "Найти инвестиции"){
      output.push(
        <View style={[styles.SelfView,styles.selfInfo]}>
          <Text>Необходимая сумма: </Text>
          <Text>100 000</Text>                  
        </View> 
      );
    }
    else if(props.userData.point == "Инвестировать"){
      output.push(
        <View style={[styles.SelfView,styles.selfInfo]}>
          <Text>Бюджет: </Text>
          <Text>100 000</Text>                  
        </View>
      );
    }
  }
  return(
    <View style={{width:"100%"}}>
      {output}
    </View>
  );
   
}

function CardSwiper(props){
  return(
    <DeckSwiper
      ref={(c) => props.cardData._deckSwiper = c}
      dataSource={props.cards}              
      renderEmpty={() =>
        <View style={{height:250,marginTop:100}}>
         <Text style={styles.AboutViewQuestion}>На этом пока всё</Text>
         <Text style={styles.projectDescription}>Загляни позже чтобы увидеть новые анкеты</Text>
        </View>
      }
      renderItem={item =>             
            <ScrollView style={{height:deviceHeight-140}}> 
                <CardItem cardBody style={{height:deviceHeight*0.4,flexDirection:"column"}}>
                  <View style={{width:"100%",height:"90%",alignItems:"center"}}>
                    <Image style={styles.ProfileImage} source={item.image} />   
                  </View>                        
                  <View style={[{position:"absolute",justifyContent:"center",bottom:20,flexDirection:"row"}]}>
                    <Button style={styles.cardResponseButton} large danger onPress={() => props.cardData._deckSwiper._root.swipeLeft()} title="Swipe Left">
                      <Icon name="trash" />
                    </Button>
                    <Button style={styles.cardResponseButton} large success onPress={() => props.cardData._deckSwiper._root.swipeRight()} title="Swipe Right">
                      <Icon name="arrow-forward" />
                    </Button>                       
                  </View>                                    
                </CardItem>
                <CardItem cardBody>
                  <View style={styles.RowView}>
                    <Text style={styles.RowViewElement}>{item.name}</Text>
                    <Text style={styles.RowViewElement}>{item.lastname}</Text> 
                    <Text style={styles.RowViewElement}>({item.username})</Text> 
                  </View> 
                </CardItem>
                <CardItem cardBody>
                  <View style={{width:"100%",alignItems:"center"}}>
                    <SelfInfo userData={item} />   
                  </View>                   
                </CardItem>
                <CardItem cardBody style={{height:125}}>
                  <PointView userData={{name:item.projectName,projectData:item.projectData}} />
                </CardItem>
            </ScrollView> 
      }
      onSwipeRight={item =>
        //this.setState({'swipedRight':item.id});
        props.cardData._swipeRight(item.id)
      }
      onSwipeLeft={item =>
        _swipeLeft(item.id)
      }      
    /> 
  );
}
function _swipeLeft(id){  
  if(newsCards[0] != undefined){
    for(var i =0; i < newsCards.length;i++){
      if(newsCards[i].id == id){
        newsCards.splice(i,0);
        break;
      }
    }
  }      
}
export default class Newsfeed extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      text:"make posts",
      Posts:{},
      loading: true,
      username:'',
      accesKey:'',
      accesGranted:'',
      swipedRight:''
    };    
  }  
  _swipeRight = async(id) => {
    ServerRequest('swipeRight',{accesKey:this.state.accesKey,ID:id}).then(function(response){
      if(newsCards[0] != undefined){
        for(var i =0; i < newsCards.length;i++){
          if(newsCards[i].id == id){
            newsCards.splice(i,1);
            break;
          }
        }
      }
    })
  } 
  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })
    this.setState({ loading: false })
    let toState = this;
    const value = await AsyncStorage.getItem('accesKey');
    if (value !== null) {
      this.setState({accesKey:value})      
      ServerRequest('getNewsfeed').then(function(response){
        newsCards = [];
        for(var i =0; i < response.length;i++){
          if(response.symps[0].symps != null){
            if( ( response[i].id != response.symps[0].id )&&( !(response.symps[0].symps.split(',').includes( (response[i].id).toString() ,0)) ) ){
              if(response[i].birthdate != null ){ 
                var date1 = new Date(response[i].birthdate);
                var date2 = new Date();
                var dateDifference = date2.getTime() - date1.getTime();
                var fullYears = Math.floor(dateDifference*3.1709791983765*(Math.pow(10,-11)));
              }
              if(response[i].myPoint != null){
                if(response[i].myPoint == "talk") response[i].myPoint = "Общения";
                if(response[i].myPoint == "searchInvest") response[i].myPoint = "Найти инвестиции";
                if(response[i].myPoint == "invest") response[i].myPoint = "Инвестировать";
                if(response[i].myPoint == "instagram") response[i].myPoint = "Больше инстаграм подписчиков";
              } 
              if( (response[i].name != null) ){
                if(response[i].profilePhoto != null){
                  newsCards.push(
                    {
                      id: response[i].id,
                      name: response[i].name,
                      lastname: response[i].lastname,
                      username: response[i].login,
                      point: response[i].myPoint,
                      age: fullYears,
                      projectName: response[i].projectName,
                      projectData: response[i].projectData,
                      image: {uri: response[i].profilePhoto},
                    },
                  );
                }
                else{
                  newsCards.push(
                    {
                      id: response[i].id,
                      name: response[i].name,
                      lastname: response[i].lastname,
                      username: response[i].login,
                      point: response[i].myPoint,
                      age: fullYears,
                      projectName: response[i].projectName,
                      projectData: response[i].projectData,
                      image: require('../../ProfilePhoto.jpg'),
                    },
                  );
                }
              }               
            } 
            else{
              console.log(response[i].name+' в листе симпатии');
            }
          }
          else{
            if( response[i].id != response.symps[0].id ){
              if(response[i].birthdate != null ){ 
                var date1 = new Date(response[i].birthdate);
                var date2 = new Date();
                var dateDifference = date2.getTime() - date1.getTime();
                var fullYears = Math.floor(dateDifference*3.1709791983765*(Math.pow(10,-11)));
              }
              if(response[i].myPoint != null){
                if(response[i].myPoint == "talk") response[i].myPoint = "Общения";
                if(response[i].myPoint == "searchInvest") response[i].myPoint = "Найти инвестиции";
                if(response[i].myPoint == "invest") response[i].myPoint = "Инвестировать";
                if(response[i].myPoint == "instagram") response[i].myPoint = "Больше инстаграм подписчиков";
              }
              if( (response[i].name != null) ){ 
                if(response[i].profilePhoto != null){
                  newsCards.push(
                    {
                      id: response[i].id,
                      name: response[i].name,
                      lastname: response[i].lastname,
                      username: response[i].login,
                      point: response[i].myPoint,
                      age: fullYears,
                      projectName: response[i].projectName,
                      projectData: response[i].projectData,
                      image: {uri: response[i].profilePhoto},
                    },
                  );
                }
                else{
                  newsCards.push(
                    {
                      id: response[i].id,
                      name: response[i].name,
                      lastname: response[i].lastname,
                      username: response[i].login,
                      point: response[i].myPoint,
                      age: fullYears,
                      projectName: response[i].projectName,
                      projectData: response[i].projectData,
                      image: require('../../ProfilePhoto.jpg'),
                    },
                  );
                } 
              }
            }
          }
        }  
        toState.setState({accesGranted:true})      
      }).catch(function(err){
        console.log(306,err);
      })
    }
    else{
      this.props.navigation.navigate('Вход')
    } 
  }
  render(){
  	if (this.state.loading) {
     return (
       <View><Text>Загрузка</Text></View>
     );
   }  	
   else{
     	if(this.state.accesGranted == true){        
  	  	if(newsCards[0] != undefined){
  			 return (
          <View style={styles.header}>            
            <View style={{height:"90%"}}>
              <CardSwiper cardData={this} cards={newsCards} />
            </View>           
            <AppHeader style={styles.appHeader} navigation={this.props.navigation}></AppHeader>
          </View>				       
  		    )		
  	  	}
        else{
          return (
            <View style={styles.header}>            
              <View style={{height:"90%"}}>
                <CardSwiper cardData={this} cards={newsCards} />
              </View>           
              <AppHeader style={styles.appHeader} navigation={this.props.navigation}></AppHeader>
            </View>
          );
        }
  	  }
    	else{
        return (  
            <View style={styles.header}>
              <View style={{height:"90%"}}>
                <View style={{height:250,marginTop:100}}>
                 <Text style={styles.AboutViewQuestion}>На этом пока всё</Text>
                 <Text style={styles.projectDescription}>Загляни позже чтобы увидеть новые анкеты</Text>
                </View>
              </View> 
              <AppHeader style={styles.appHeader} navigation={this.props.navigation}></AppHeader>
            </View>
          )
      }  
  	}      
  }  
}