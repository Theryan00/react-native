import React, {useState, useEffect} from 'react';
import { Text, View, Image, Button, StyleSheet} from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';
import { firebase } from './src/firebase/config';

import MainTabNavigator from "./navigation/MainTabNavigator";

const App = () => {
  const initialOrderItem = {
    consumer: "",
    date: ((new Date()).getMonth() + 1)+"/"+(new Date()).getDate()+"/"+(new Date()).getFullYear(),
    finished: false,
    id: uuidv4(),
    menuItems: {
    },
    totalPrice: 0,
    table: 0
  };
  const [orderItem, setOrderItem] = useState(initialOrderItem);
  
  const initializeOrderItem = () => {
    setOrderItem(initialOrderItem);
  }

  const [allMenuItems, setAllMenuItems] = useState({});

  // Handle change in menu items data on firebase
  const onMenuItemsDataChange = (items) => {
    let allMenuItems = {};

    items.forEach((item) => {
      var menuItemDetails = {};
      menuItemDetails["menuItemName"] = item.val().menuItemName;
      menuItemDetails["price"] = item.val().price;
      menuItemDetails["menuCategoryId"] = item.val().menuCategoryId;
      menuItemDetails["image"] = item.val().image;
      menuItemDetails["description"] = item.val().description;
      allMenuItems[item.key] = menuItemDetails;
    });

    setAllMenuItems(allMenuItems);
  };

  // Listen to data change in firebase
  useEffect(() => {
    firebase.database().ref('/menuItems').on("value", onMenuItemsDataChange);

    return () => {
      firebase.database().ref('/menuItems').off("value", onMenuItemsDataChange);
    };
  }, []); 

  return (
  <MainTabNavigator 
    screenProps = {{
      orderItem: orderItem,
      setOrderItem: setOrderItem,
      allMenuItems: allMenuItems,
      initializeOrderItem: initializeOrderItem
    }}
  />
  )
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default App;