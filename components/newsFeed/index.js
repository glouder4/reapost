import React, { Component } from "react";
import NewsFeed from "./newsFeed.js";
//import MainScreenNavigator from "../ChatScreen/index.js";
//import ProfileScreen from "../ProfileScreen/index.js";
//import SideBar from "../SideBar/SideBar.js";
import AppHeader from '../AppHeader';
import { createDrawerNavigator } from '@react-navigation/drawer';
const NewsFeedRouter = createDrawerNavigator();

function MyDrawer() {
  return (
    <NewsFeedRouter.Navigator>
      <NewsFeedRouter.Screen name="NewsFeed" component={NewsFeed} />
    </NewsFeedRouter.Navigator>
  );
}
export default NewsFeedRouter;