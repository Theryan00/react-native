import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, VirtualizedList, TouchableOpacity, TouchableHighlight, Image, Modal, TextInput } from 'react-native';
import { firebase } from '../src/firebase/config';
import InputSpinner from "react-native-input-spinner";
import { FontAwesome } from '@expo/vector-icons';
import { Input, Button } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';

const Checkout = (props) => { 
    const saveOrder = () => {
      firebase.database().ref('/orders').child(props.screenProps.orderItem.id).set(props.screenProps.orderItem);
      props.screenProps.initializeOrderItem();
      props.navigation.navigate("Cart");
    };

    const updateEmail = (email) => {
      props.screenProps.setOrderItem({ ...props.screenProps.orderItem, ["consumer"]: email});
    }

    const updateTable = (table) => {
      props.screenProps.setOrderItem({ ...props.screenProps.orderItem, ["table"]: table});
    }

    const invalid = () => {
      if(props.screenProps.orderItem.table == 0 ||  props.screenProps.orderItem.consumer == "") return true;
      else return false;
    }

    const [tables, setTables] = useState([]);

    // Handle change in menu items data on firebase
    const onTablesDataChange = (items) => {
      let tables = [];

      items.forEach((item) => {
        var table = {};
        table["label"] = "Table " + item.val();
        table["value"] = item.val();
        tables.push(table);
      });

      setTables(tables);
    };

    useEffect(() => {
      firebase.database().ref('/tables').on("value", onTablesDataChange);

      return () => {
        firebase.database().ref('/tables').off("value", onTablesDataChange);
      };
    }, []);

    return(
        <View style={styles.container}>
          <FlatList
              data={Object.keys(props.screenProps.orderItem.menuItems)}
              renderItem={({ item }) => (
                  <TouchableOpacity style={styles.card}>
                      <View style={styles.cardContent}>
                      <View>
                          <Text style={styles.cardTitle}>{props.screenProps.allMenuItems[item].menuItemName}</Text>
                          <Text style={styles.cardSubtitle}>€{props.screenProps.allMenuItems[item].price}</Text>
                      </View>
                      <View style={styles.cardTotals}>
                        <Text style={styles.cardTitle}>€{props.screenProps.orderItem.menuItems[item].quantity * props.screenProps.allMenuItems[item].price}</Text>
                      </View>
                      </View>
                  </TouchableOpacity> 
              )}
          />

          <TouchableOpacity style={styles.card}>
            <View style={styles.cardContent}>
              <View>
              </View>
              <View style={styles.cardTotals}>
                <Text style={styles.totalText}>Total: €{props.screenProps.orderItem.totalPrice}</Text>
              </View>
            </View>
          </TouchableOpacity> 
          
          <TextInput style = {styles.input}
            placeholder = "Enter your email..."
            onChangeText={value => updateEmail(value)}
          />

          <DropDownPicker
            items={tables}
            containerStyle={{
              height: 40,
              marginRight: 10,
              marginLeft: 10,
              marginBottom: 10
            }}
            placeholder="Select your table..."
            labelStyle={{
              color: '#000'
            }}
            onChangeItem={item => updateTable(item.value)}
          />
          
          <Button
            title="Order"
            titleStyle={{
              color: "white",
              fontSize: 24,
            }}
            buttonStyle={{
              backgroundColor: "black",
              marginRight:10,
              marginLeft:10,
            }}
            onPress={() => {
              saveOrder();
            }}
            disabled={invalid()}
          />
      </View>
    );
};

const styles = StyleSheet.create({
    input: {
      backgroundColor: '#FFF',
      margin: 10,
      height: 40,
      paddingLeft: 10,
      borderRadius: 5,
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
    cardTotals: {
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

export default Checkout;

