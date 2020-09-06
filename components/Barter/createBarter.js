import * as React from 'react';
import { StyleSheet, Button,View,Image,ScrollView,AsyncStorage} from 'react-native';
import { Container, Header, Content, Form, Item, Input,Textarea, Label,Text,Footer, FooterTab, Icon, Badge, Tabs } from 'native-base';
import * as Font from 'expo-font';
import ServerRequest from '../ServerRequest.js';
import { Ionicons } from '@expo/vector-icons';

import AppHeader from '../AppHeader';

export default class createBarter extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        loading: true,
        accesKey:'',
        accesGranted:false,
        barterName:'',
        barterData:'',
        barterTo:'',
        selfID:'',
        forbiddenCharactersName:false,
        forbiddenCharactersData:false
      }
      this.handleChangeNameOfBarter = this.handleChangeNameOfBarter.bind(this);
      this.handleChangeBarterData = this.handleChangeBarterData.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);      
  }
  handleChangeNameOfBarter(event) {
    this.setState({barterName: event.nativeEvent.text });
  }
  handleChangeBarterData(event) {
    this.setState({barterData: event.nativeEvent.text });
  }
  handleSubmit(event){
    if(this.state.barterName != ''){
      let toState = this;
      let barterName = this.state.barterName;
      let barterData = this.state.barterData;
      //this.setState({barterName: '' });
      //this.setState({barterData: '' });
      ServerRequest('createBarter',{accesKey:toState.state.accesKey,selfID:toState.state.selfID,barterTo:toState.state.barterTo,barterName:barterName,barterData:barterData}).then(function(response){
        toState.props.navigation.navigate('Бартеры')
      }).catch(function (error) {
        console.log(error.response.data);
        if(error.response.data == "forbiddenCharacters-data"){
          toState.setState({forbiddenCharactersData: true });
        }
        else if(error.response.data == "forbiddenCharacters-name"){
          toState.setState({forbiddenCharactersName: true });
        }
        else{
          console.log(error);
          /*AsyncStorage.removeItem('accesKey',function(err){
            console.log('deleted');
            toState.props.navigation.navigate('Вход')
          })*/
        }        
      });
    }     
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })
    this.setState({ loading: false })
    const value = await AsyncStorage.getItem('accesKey'); 
    if (value !== null) {
      this.setState({accesKey:value})
      console.log(this.props.route.params);
      this.setState({selfID:this.props.route.params.selfID})
      this.setState({barterTo:this.props.route.params.userID})

      this.setState({accesGranted:true})
    }
    else{
      this.props.navigation.navigate('Вход')
    }    
  }  
  render() {  
    if (this.state.loading) {
       return (
         <View></View>
       );
    }
    if(this.state.accesGranted == false){ 
      return (
       <View></View>
     );
    }    
    else{ 
      if((this.state.forbiddenCharactersData == false)&&(this.state.forbiddenCharactersName == false) ){
        return (
          <View style={styles.header}>
            <View style={{height:"90%"}}>
              <Form style={{marginTop:'15%',alignItems: 'stretch', justifyContent: 'center'}}>
                <Text style={{ width: '80%',marginLeft:'10%' }}>Что вы предлагаете?</Text>
                <Item style={{width: '80%',marginLeft:'10%',marginBottom:50}} floatingLabel last>
                  <Label>Короткое предложение</Label>
                  <Input value={this.state.barterName} onChange={this.handleChangeNameOfBarter} />
                </Item>
                <Text style={{ width: '80%',marginLeft:'10%' }}>Расскажите подробнее</Text>
                <Textarea style={{ width: '80%',marginLeft:'10%',marginBottom:25 }} rowSpan={5} bordered placeholder="Рекомендуется" value={this.state.barterData} onChange={this.handleChangeBarterData} />
                <Button color="rgba(52, 52, 52, 0.8)" title="Создать бартер" onPress={this.handleSubmit}></Button>
              </Form>
            </View> 
            <AppHeader navigation={this.props.navigation}></AppHeader>
          </View>
        );      
      }  
      else if(this.state.forbiddenCharactersData){
        return (
          <View style={styles.header}>
            <View style={{height:"90%"}}>
              <Form style={{marginTop:'15%',alignItems: 'stretch', justifyContent: 'center'}}>
                <Text style={{ width: '80%',marginLeft:'10%' }}>Что вы предлагаете?</Text>
                <Item style={{width: '80%',marginLeft:'10%',marginBottom:50}} floatingLabel last>
                  <Label>Короткое предложение</Label>
                  <Input value={this.state.barterName} onChange={this.handleChangeNameOfBarter} />
                </Item>
                <Text style={{ width: '80%',marginLeft:'10%',color:"red" }}>Введены запрещенные символы </Text>
                <Text style={{ width: '80%',marginLeft:'10%', }}>Расскажите подробнее</Text>
                <Textarea style={{ width: '80%',marginLeft:'10%',marginBottom:25 }} rowSpan={5} bordered placeholder="Рекомендуется" value={this.state.barterData} onChange={this.handleChangeBarterData} />
                <Button color="rgba(52, 52, 52, 0.8)" title="Создать бартер" onPress={this.handleSubmit}></Button>
              </Form>
            </View> 
            <AppHeader navigation={this.props.navigation}></AppHeader>
          </View>
        );
      } 
      else if(this.state.forbiddenCharactersName){
        console.log(this.state);
        return (
          <View style={styles.header}>
            <View style={{height:"90%"}}>
              <Form style={{marginTop:'15%',alignItems: 'stretch', justifyContent: 'center'}}>
                <Text style={{ width: '80%',marginLeft:'10%',color:"red" }}>Введены запрещенные символы </Text>
                <Text style={{ width: '80%',marginLeft:'10%' }}>Что вы предлагаете?</Text>
                <Item style={{width: '80%',marginLeft:'10%',marginBottom:50}} floatingLabel last>
                  <Label>Короткое предложение</Label>
                  <Input value={this.state.projectName} onChange={this.handleChangeNameOfBarter} />
                </Item>                
                <Text style={{ width: '80%',marginLeft:'10%', }}>Расскажите подробнее</Text>
                <Textarea style={{ width: '80%',marginLeft:'10%',marginBottom:25 }} rowSpan={5} bordered placeholder="Рекомендуется" value={this.state.projectData} onChange={this.handleChangeBarterData} />
                <Button color="rgba(52, 52, 52, 0.8)" title="Создать бартер" onPress={this.handleSubmit}></Button>
              </Form>
            </View> 
            <AppHeader navigation={this.props.navigation}></AppHeader>
          </View>
        );
      } 
      else{
        return(<View></View>)
      }  
    }
  }
}

const styles = StyleSheet.create({
  instagramView:{
    height: 40,
    width: 450,        
    justifyContent: 'center',
    borderRadius:82 / 2,
  },
  BiographyTitle:{
    fontSize: 20,
    color: 'black', 
  },
  BiographyContainer:{
    marginLeft:'2%',
  },
  RowView:{
    flexDirection: "row",
    zIndex:2,
    marginLeft:'2%',
    padding:3,
    height:'100%'
  },
  RowViewEditElement:{
    fontSize: 20,
    color: 'black',    
  },
  AboutView:{
    zIndex:2,
    marginLeft:'2%',
    padding:3,
    height:"10%"
  },
  selfInfo:{
    padding:'3%',
    marginLeft:'2%',
  },
  SelfView:{
    flexDirection: "row",
    justifyContent:'space-between',
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
  AboutViewElement:{
    fontSize: 13,
    color: 'silver',    
    marginLeft:'1%'
  },
  RowViewElement:{
    fontSize: 20,
    color: 'black',    
    marginLeft:'1%'
  },
  contentView:{
    height:'95%'
  },
  header:{
    height:'100%',
    width:'100%',
    zIndex:1,
    backgroundColor:'#fff'
  },
  ProfileImage:{
    width:'100%',
    height:'100%',
    resizeMode:'stretch'
  },
  DarkMask:{
    position: 'absolute',
    width:'100%',
    height:'50%',
    backgroundColor:'rgba(0,0,0,0.5)',
    zIndex:1
  },
  changeProfilePhotoButton:{
    position: 'absolute',
    bottom:0,
    alignItems:'center',
    marginLeft:'30%',
    zIndex:1
  }
});