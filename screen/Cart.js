import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, VirtualizedList, TouchableOpacity, TouchableHighlight, Image, Button, Modal } from 'react-native';
import { firebase } from '../src/firebase/config';
import InputSpinner from "react-native-input-spinner";
import { FontAwesome } from '@expo/vector-icons';

const Cart = (props) => {  
  if(Object.keys(props.screenProps.orderItem.menuItems).length <= 0){ // If cart is empty
    return(
      <View>
        <Text style={styles.emtpyCartMessage}>Cart is still empty...</Text>
      </View>
    );
  }
  else{ 
    return(
      <View style={styles.container}>
        <FlatList
          data={Object.keys(props.screenProps.orderItem.menuItems)}
          renderItem={({ item }) => (
            // <Text>{allMenuItems[item].menuItemName}</Text>
            <TouchableOpacity style={styles.card}>
              <View style={styles.cardContent}>
                <View>
                  <Text style={styles.cardTitle}>{props.screenProps.allMenuItems[item].menuItemName}</Text>
                  <Text style={styles.cardSubtitle}>€{props.screenProps.allMenuItems[item].price}</Text>
                </View>
                <View style={styles.cardContentAdd}>
                  <View style={styles.spinnerContainer}>
                    <InputSpinner
                      initialValue = {props.screenProps.orderItem.menuItems[item].quantity}
                      value = {props.screenProps.orderItem.menuItems[item].quantity}
                      step={1}
                      color = 'black'
                      colorPress = '#EAEAEA'
                      height = {28}
                      width = {95}
                      showBorder = {true}
                      rounded={false}
                      buttonFontSize = {16}
                      onChange = {(num) => {
                        let tempOrderItem = {};
                        for (const id in props.screenProps.orderItem){
                          tempOrderItem[id] = props.screenProps.orderItem[id];
                        }
                        tempOrderItem.menuItems[item].quantity = num;
                        props.screenProps.setOrderItem(tempOrderItem);
                      }}
                      onIncrease = {(increase) => {
                        var newTotalPrice = parseInt(props.screenProps.orderItem.totalPrice) + parseInt(props.screenProps.allMenuItems[item].price);
                        let tempOrderItem = {};
                        for (const id in props.screenProps.orderItem){
                          tempOrderItem[id] = props.screenProps.orderItem[id];
                        }
                        tempOrderItem.totalPrice = newTotalPrice;
                        props.screenProps.setOrderItem(tempOrderItem);
                      }}
                      onDecrease = {(decrease) => {
                        var newTotalPrice = parseInt(props.screenProps.orderItem.totalPrice) - parseInt(props.screenProps.allMenuItems[item].price);
                        let tempOrderItem = {};
                        for (const id in props.screenProps.orderItem){
                          tempOrderItem[id] = props.screenProps.orderItem[id];
                        }
                        tempOrderItem.totalPrice = newTotalPrice;
                        props.screenProps.setOrderItem(tempOrderItem);
                      }}
                      onMin = {(min) => {
                        let tempOrderItem = {};
                        for (const id in props.screenProps.orderItem){
                          tempOrderItem[id] = props.screenProps.orderItem[id];
                        }
                        delete tempOrderItem.menuItems[item];
                        props.screenProps.setOrderItem(tempOrderItem);
                      }}
                    /> 
                  </View>
                  <TouchableOpacity
                    style={styles.cardButton}
                    underlayColor='#fff'
                    onPress={() => {
                      let tempOrderItem = {};
                      for (const id in props.screenProps.orderItem){
                        tempOrderItem[id] = props.screenProps.orderItem[id];
                      }
                      delete tempOrderItem.menuItems[item];
                      props.screenProps.setOrderItem(tempOrderItem);
                    }}
                  >
                    <FontAwesome name="trash" size={20} color="white"/>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity> 
          )}
        />

        <TouchableOpacity style={styles.card}>
          <View style={styles.cardContent}>
            <View>
            </View>
            <View style={styles.cardContentAdd}>
              <Text style={styles.totalText}>Total: €{props.screenProps.orderItem.totalPrice}</Text>
            </View>
          </View>
        </TouchableOpacity> 

        <TouchableOpacity
          style={styles.checkoutButton}
          underlayColor='#fff'
          onPress={() => {
            props.navigation.navigate("Checkout");
          }}
        >
            <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  emtpyCartMessage: {
    textAlign: 'center',
    marginTop: 100,
    marginBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    // paddingBottom: 0,
    fontSize: 20,
    fontWeight: 'bold'
  },
  container: {
    marginTop: 15,
    marginBottom: 30,
    justifyContent: 'center'
  },
  card:{
    backgroundColor: '#FFF',
    marginBottom:12,
    marginLeft: '2%',
    width: '95%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
    borderRadius: 7,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardContentAdd: {
    // backgroundColor: 'gold',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8
    // flexDirection: 'column-reverse'
  },
  cardButton: {
    height: 30,
    marginRight:10,
    marginLeft:10,
    marginTop: 15,
    marginBottom: 11,
    paddingHorizontal: 10,
    paddingVertical: 2,
    backgroundColor:'black',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff'
  },
  cardButtonText: {
    color:'#fff',
    textAlign:'center',
    fontSize: 13
  },
  cardImage:{
    width: '100%',
    height: 180,
    resizeMode: 'cover'
  },
  cardTitle:{
    marginTop: 7,
    marginBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    // paddingBottom: 0,
    fontSize: 20,
    fontWeight: 'bold'
  },
  cardSubtitle:{
    // paddingTop: 0,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    fontSize: 14
  },
  spinnerContainer:{
    marginBottom: 12,
    height: 28
  },
  checkoutButton:{
    height: 50,
    marginRight:10,
    marginLeft:10,
    marginTop: 15,
    marginBottom: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor:'black',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff'
  },
  checkoutButtonText:{
    color:'#fff',
    textAlign:'center',
    fontSize: 24
  },
  totalText: {
    marginTop: 7,
    marginBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    // paddingBottom: 0,
    fontSize: 20,
    fontWeight: 'bold',
    color:'black',
    textAlign:'right',
    fontSize: 20
  }
});

export default Cart;

