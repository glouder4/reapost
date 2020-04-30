import React from 'react';
import { AppLoading } from 'expo';
import { Container, Header, Content, Footer,Label,Item,FooterTab, Icon, Text, Badge,Tabs,Form,Input,Textarea } from 'native-base';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View,Image,ScrollView,Button,AsyncStorage } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

import AppHeader from '../AppHeader';

let ProfileObject;
function HeaderProfile(props){
  console.log(props.profileObject.state.image);
  if(props.profileObject.state.image == ""){
    return(
      <View style={{height:'30%'}}>
        <Image style={styles.ProfileImage} source={require('../../ProfilePhoto.jpg')} />
        <View style={styles.DarkMask}></View>
        <View style={styles.changeProfilePhotoButton}>
          <Button color="rgba(52, 52, 52, 0.8)" title="Сменить фото" onPress={props.profileObject._pickImage }></Button>
        </View>          
      </View>
    );
  }else{
    return(
      <View style={{height:'30%'}}>
        <Image style={styles.ProfileImage} source={{uri: props.profileObject.state.image}} />
        <View style={styles.DarkMask}></View>
        <View style={styles.changeProfilePhotoButton}>
          <Button color="rgba(52, 52, 52, 0.8)" title="Сменить фото" onPress={props.profileObject._pickImage }></Button>
        </View>          
      </View>
    );
  }  
}
function Biography(props){
  return(
    <View style={styles.BiographyContainer}>
      <Text style={styles.BiographyTitle}>Биография</Text>
      <ScrollView>
        <Text>
          {props.profileObject.state.biography}
        </Text>
        <Button color="rgba(52, 52, 52, 0.8)" title="Редактировать профиль" onPress={() => props.profileObject.setState({editProfile:true})}></Button>
      </ScrollView>  
    </View>
  );
}
function EditProfile(props){
  if(props.profileObject.state.name == 'Не указано')props.profileObject.state.name = '';
  if(props.profileObject.state.lastname == 'Не указано')props.profileObject.state.lastname = '';
  return(
    <Container>
      <Content padder>
        <Form>
          <View>
            <Item floatingLabel>
              <Label>Имя</Label>                
              <Input value={props.profileObject.state.name} onChange={props.profileObject.handleChangeName} />
            </Item>
            <Item floatingLabel>
              <Label>Фамилия</Label>                
              <Input value={props.profileObject.state.lastname} onChange={props.profileObject.handleChangeLastname} />
            </Item>
          </View>
          <Text style={styles.BiographyTitle}>Биография</Text>
          <Textarea rowSpan={5} bordered placeholder="Textarea" onChange={props.profileObject.handleChangeBiography} />
        </Form>
        <Button color="rgba(52, 52, 52, 0.8)" title="Сохранить" onPress={props.profileObject.handleSubmit}></Button>
      </Content>
    </Container>
  )
} 
export default class Profile extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      username:'',
      name:'',
      lastname:'',
      biography:"",
      accesKey:'',
      accesGranted:'',
      editProfile:false,
      image:"",
    }
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeLastname = this.handleChangeLastname.bind(this);
    this.handleChangeBiography = this.handleChangeBiography.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChangeName(event) {
    this.setState({name: event.nativeEvent.text });
  }
  handleChangeLastname(event) {
    this.setState({lastname: event.nativeEvent.text });
  }
  handleChangeBiography(event) {
    this.setState({biography: event.nativeEvent.text });
  }
  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
        let toState = this;
        let userdata = { data: { 
          accessKey: toState.state.accesKey,
          image: toState.state.image
        }};
        console.log(result);
          axios.post('http://192.168.0.104:3000/updateUserPhoto', JSON.stringify(userdata)).then(function (response) {
            console.log("updated");
          }).catch(function (error) {
            AsyncStorage.removeItem('accesKey',function(){
              console.log('deleted');
              toState.props.navigation.navigate('StartScreen');
            }) 
          })
      }
    } catch (E) {
      console.log(E);
    }
  };
  handleSubmit(event) {
    if(this.state.name == '') this.setState({name: 'Не указано' });
    if(this.state.lastname == '') this.setState({lastname: 'Не указано' });
    if(this.state.biography == "") this.setState({biography: 'Не заполнено' });
    let toState = this;  
    let userdata = { data: { 
      name: toState.state.name,
      lastname: toState.state.lastname,
      biography: toState.state.biography,
      accessKey: toState.state.accesKey
    }};
    axios.post('http://192.168.0.104:3000/updateUser', JSON.stringify(userdata)).then(function (response) {
      toState.setState({editProfile:false})
    }).catch(function (error) {
      toState.props.navigation.navigate('StartScreen')
    });       
    event.preventDefault();
  }
  componentDidMount() {
    this.getPermissionAsync();
  }
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
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
      this.setState({accesGranted:true})
      let toState = this;
      axios.post('http://192.168.0.104:3000/Profile', JSON.stringify(this.state.accesKey)).then(function (response) {
          if(response.data[0].name != null) toState.setState({name:response.data[0].name})
          else toState.setState({name:'Не указано'})
          if(response.data[0].lastname != null) toState.setState({lastname:response.data[0].lastname})
          else toState.setState({lastname:'Не указано'})
          if(response.data[0].biography != null) toState.setState({biography:response.data[0].biography})
          else toState.setState({biography:'Не заполнено'})
          if(response.data[0].profilePhoto != null) toState.setState({image:response.data[0].profilePhoto})
          else toState.setState({image:""})
          toState.setState({username:response.data[0].login});        
      }).catch(function (error) {
          AsyncStorage.removeItem('accesKey',function(){
          console.log('deleted');
          toState.props.navigation.navigate('StartScreen')
        }) 
      }); 
    }
    else{
      this.props.navigation.navigate('StartScreen')
    } 
  }
  render(){      
    	if (this.state.loading == false) {
       return (
         <View></View>
       );
     }  	     
      if(this.state.accesGranted == true){
        if(this.state.editProfile == false){
          return (
            <View style={styles.header}>
              <View style={styles.contentView}>
                <HeaderProfile profileObject={this} />       
                <View style={styles.RowView}>
                  <Text style={styles.RowViewElement}>Имя: {this.state.name}</Text>
                  <Text style={styles.RowViewElement}>Фамилия: {this.state.lastname}</Text> 
                  <Text style={styles.RowViewElement}>Никнейм: ({this.state.username})</Text> 
                </View>
                <Biography profileObject={this} />
              </View> 
              <AppHeader navigation={this.props.navigation}></AppHeader>
            </View>
          );
        }
        else{
          return(
            <EditProfile profileObject={this}/>
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
  BiographyTitle:{
    fontSize: 20,
    color: 'black', 
  },
  BiographyContainer:{
    marginLeft:'2%',
    flex:1
  },
  RowView:{
    position: 'absolute',
    zIndex:2,
    marginLeft:'2%',
    top:'15%'
  },
  RowViewEditElement:{
    fontSize: 20,
    color: 'black',    
  },
  RowViewElement:{
    fontSize: 20,
    color: 'white',    
  },
  contentView:{
    height:'95%'
  },
  header:{
    height:'100%',
    width:'100%',
    zIndex:1,
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