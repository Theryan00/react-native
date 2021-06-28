import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import Menu from '../screen/Menu';
import Cart from '../screen/Cart';
import Orders from '../screen/Orders';
import Checkout from '../screen/Checkout';

// Menu
const MenuStack = createStackNavigator({
    Menu: Menu,
});

MenuStack.navigationOptions = {
    tabBarLabel: "Menu",
    tabBarIcon: ({tintColor}) => (
        <Ionicons name="restaurant" size={22} color={tintColor} />
    )
}

// Cart
const CartStack = createStackNavigator({
    Cart: Cart,
    Checkout: Checkout
});

CartStack.navigationOptions = {
    tabBarLabel: "Cart",
    tabBarIcon: ({tintColor}) => (
        <Ionicons name="cart" size={22} color={tintColor} />
    )
}

// Orders
const OrdersStack = createStackNavigator({
    Orders: Orders,
});

OrdersStack.navigationOptions = {
    tabBarLabel: "Orders",
    tabBarIcon: ({tintColor}) => (
        <Ionicons name="clipboard" size={22} color={tintColor} />
    )
}

const TabNavigator = createBottomTabNavigator({
    MenuStack,
    CartStack,
    OrdersStack
});

export default createAppContainer(TabNavigator);