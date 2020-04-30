import * as React from 'react';
import { StyleSheet, Button,View,Image,ScrollView,AsyncStorage} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label,Text,Footer, FooterTab, Icon, Badge, Tabs } from 'native-base';
import * as Font from 'expo-font';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  FirstTitle:{
    fontSize:20,
    textAlign:'center',
    marginTop:'20%'
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
    borderColor:'red',
    textAlign:'center',
  },
  Success:{
    color:'green',
    borderColor:'green'
  }
});

export default class SignUp extends React.Component{
  constructor(props) {
      super(props);
      this.state = {
        loading: true,
        username:'',
        password:'',
        name:'',
        lastname:'',
        success:false,
        accesKey:'',
        accesGranted:'',
        dataIncorrect:false,
        wrong:false,
        wrongMessage:''
      };
      this.handleChangeUsername = this.handleChangeUsername.bind(this);
      this.handleChangePassword = this.handleChangePassword.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChangeUsername(event) {
    this.setState({username: event.nativeEvent.text });
  }
  handleChangePassword(event) {
    this.setState({password: event.nativeEvent.text });
  }
  handleSubmit(event) {
    if((this.state.username == '')||(this.state.password == '')){
      this.setState({wrong: true });
    }
    else{
      this.setState({wrong: false });
      let toState = this;  
      let userdata = { data: { 
        login: toState.state.username,
        password: toState.state.password,
      }};
      axios.post('http://192.168.0.104:3000/AuthorizeUser', JSON.stringify(userdata)).then(function (response) {
      	AsyncStorage.setItem('accesKey',response.data,function(){
      		toState.setState({success:true});
        	toState.setState({accesKey:response.data}); 
	     	toState.props.navigation.navigate('Profile',response.data)	
	    });
      }).catch(function (error) {
          toState.setState({wrong:true});
          toState.setState({wrongMessage:'Не правильынй логин или пароль'});
      });        
    }         
    event.preventDefault();
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });    
    this.setState({ loading: false })
    let toState = this;
    const value = await AsyncStorage.getItem('accesKey');
    if (value !== null) {
      this.props.navigation.navigate('Profile',value)
    }
    else{
      toState.setState({accesGranted:'false'})
    }    
  }  
  render() {  
    if (this.state.loading) {
       return (
         <View></View>
       );
    }
    if(this.state.accesGranted == ''){
      return (
       <View></View>
     );
    }    
      if(this.state.wrong == false){
        if(this.state.success == false){
            return (
              <View style={styles.blockContainer}>
                  <Text style={styles.FirstTitle}>
                    Авторизация
                  </Text>
                  <Form>
                      <Item floatingLabel>
                        <Label>Логин</Label>                
                        <Input value={this.state.username} onChange={this.handleChangeUsername} />
                      </Item>
                      <Item style={{marginBottom:50}} floatingLabel last>
                        <Label>Пароль</Label>
                        <Input secureTextEntry={true} value={this.state.password} onChange={this.handleChangePassword} />
                      </Item>   
                      <Button title="Войти" onPress={this.handleSubmit}/>    
                  </Form>         
              </View>     
            )
        } 
        else{
          return (
            <View style={styles.blockContainer}>
                <Text style={styles.FirstTitle}>
                  Авторизация
                </Text>
                <Text style={styles.Success}>
                  Успех
                </Text>
                <Form>
                    <Item floatingLabel>
                      <Label>Логин</Label>                
                      <Input style={styles.Success} value={this.state.username} onChange={this.handleChangeUsername} />
                    </Item>
                    <Item style={{marginBottom:50}} floatingLabel last>
                      <Label>Пароль</Label>
                      <Input style={styles.Success} secureTextEntry={true} value={this.state.password} onChange={this.handleChangePassword} />
                    </Item>   
                    <Button title="Войти" onPress={this.handleSubmit}/>    
                </Form>         
            </View>     
          )  
        }           
       }  
       else{
        if(this.state.wrongMessage != ''){
          return (
            <View style={styles.blockContainer}>
                <Text style={styles.FirstTitle}>
                  Авторизация
                </Text>
                <Text style={styles.smthWrong}>
                  {this.state.wrongMessage}
                </Text>
                <Form>
                    <Item floatingLabel>
                      <Label>Логин</Label>                
                      <Input value={this.state.username} onChange={this.handleChangeUsername} />
                    </Item>
                    <Item style={{marginBottom:50}} floatingLabel last>
                      <Label>Пароль</Label>
                      <Input secureTextEntry={true} value={this.state.password} onChange={this.handleChangePassword}/>
                    </Item>   
                    <Button title="Войти" onPress={this.handleSubmit}/>    
                </Form>         
            </View>     
          ) 
        }else{
          return (
            <View style={styles.blockContainer}>
                <Text style={styles.FirstTitle}>
                  Авторизация
                </Text>
                <Text style={styles.smthWrong}>
                  Заполнены не все поля
                </Text>
                <Form>
                    <Item floatingLabel>
                      <Label>Логин</Label>                
                      <Input value={this.state.username} onChange={this.handleChangeUsername} />
                    </Item>
                    <Item style={{marginBottom:50}} floatingLabel last>
                      <Label>Пароль</Label>
                      <Input secureTextEntry={true} value={this.state.password} onChange={this.handleChangePassword}/>
                    </Item>   
                    <Button title="Войти" onPress={this.handleSubmit}/>    
                </Form>         
            </View>     
          ) 
        }            
       }
    
  }
}