import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Button,View,Image,ScrollView } from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label,Text,Footer, FooterTab, Icon, Badge, Tabs } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//Pages
import Route from './components/StackRoute.js';

export default class App extends React.Component{
   constructor() {
    super();
    this.state = {
      loading: false
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });    
    this.setState({ loading: false })
  }
  render() {
    if (this.state.loading) {
         return (
           <View></View>
         );
       }
      return (
        <Route></Route>
      )
  }
}
