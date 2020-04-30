import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import StartScreen from './StartScreen/StartScreen.js';
import SignUp from './Sign/SignUp.js';
import SignIn from './Sign/SignIn.js';
import NewsFeed from './newsFeed/NewsFeed.js';
import Profile from './Profile/Profile.js';
const Stack = createStackNavigator();
function Route(){    
  return (
    <NavigationContainer>
        <Stack.Navigator>
        	<Stack.Screen name="StartScreen" component={StartScreen} />
        	<Stack.Screen name="SignUp" component={SignUp} />
        	<Stack.Screen name="SignIn" component={SignIn} />
        	<Stack.Screen name="NewsFeed" component={NewsFeed} />
        	<Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>    
    </NavigationContainer>
  );
}
export default Route;