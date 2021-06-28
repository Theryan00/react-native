import { setStatusBarNetworkActivityIndicatorVisible, StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TouchableHighlight, Image, Button, Modal } from 'react-native';
import { firebase } from '../src/firebase/config';
import InputSpinner from "react-native-input-spinner";
import {MaterialIcons} from '@expo/vector-icons';

const Menu = (props) => {
  const [menuCategories, setMenuCategories] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [displayedMenuItems, setDisplayedMenuItems] = useState();
  const [modalOpen, setModalOpen] = useState(false);

  // Selected menu item data
  const [selectedMenuItem, setSelectedMenuItem] = useState({});

  const [menuItemQuantities, setMenuItemQuantities] = useState(() => {
    let menuItemQuantities = {};

    firebase.database().ref('/menuItems').once("value", function(items){
      items.forEach((item) => {
        menuItemQuantities[item.key] = 0;
      });
    });

    return menuItemQuantities;
  });

  // Handle change in menu category data on firebase
  const onMenuCategoryDataChange = (items) => {
      let menuCategories = [];

      var all = {};
      all["id"] = "all";
      all["name"] = "All";
      menuCategories.push(all);

      items.forEach((item) => {
        var menuCategory = {};
        menuCategory["id"] = item.key;
        menuCategory["name"] = item.val();
        menuCategories.push(menuCategory);
      });
  
      setMenuCategories(menuCategories);
  };

  // Handle change in menu items data on firebase
  const onMenuItemsDataChange = (items) => {
      let allMenuItems = [];

      items.forEach((item) => {
        var menuItem = {};
        menuItem["id"] = item.key;
        menuItem["menuItemName"] = item.val().menuItemName;
        menuItem["price"] = item.val().price;
        menuItem["menuCategoryId"] = item.val().menuCategoryId;
        menuItem["image"] = item.val().image;
        menuItem["description"] = item.val().description;
        allMenuItems.push(menuItem);
      });
  
      setAllMenuItems(allMenuItems);

      if(selectedCategoryId == "all") setDisplayedMenuItems(allMenuItems);
      else filterMenuItems(selectedCategoryId);
  };

  // Filter menu items based on selected category
  const filterMenuItems = () => {
    if(selectedCategoryId == "all") setDisplayedMenuItems(allMenuItems);
    else {
      let displayedMenuItems = [];

      allMenuItems.forEach((item) => {
        if(item.menuCategoryId == selectedCategoryId){
          displayedMenuItems.push(item);
        }
      });

      setDisplayedMenuItems(displayedMenuItems);
    }
  }

  // Handles "Add" buttons
  const addMenuItemQuantity = (item) => {
    if(menuItemQuantities[item.id] > 0){ // If quantity is larger than 0
      const { menuItems } = props.screenProps.orderItem;
      var newTotalPrice = menuItemQuantities[item.id] * item.price + props.screenProps.orderItem.totalPrice;

      if(props.screenProps.orderItem["menuItems"][item.id] === undefined) { // If menu item has not been added before
        props.screenProps.setOrderItem({ ...props.screenProps.orderItem, ["menuItems"]: {...menuItems, [item.id]: {"quantity": menuItemQuantities[item.id]}}, ["totalPrice"]: newTotalPrice});
      }
      else{ // If menu item has been added before
        var newQuantity = menuItemQuantities[item.id] + props.screenProps.orderItem["menuItems"][item.id]["quantity"];
        props.screenProps.setOrderItem({ ...props.screenProps.orderItem, ["menuItems"]: {...menuItems, [item.id]: {"quantity": newQuantity}}, ["totalPrice"]: newTotalPrice});
      }

      // Reset quantity to zero
      let tempMenuItemQuantities = {};

      for (const id in menuItemQuantities){
        tempMenuItemQuantities[id] = menuItemQuantities[id];
      }
      tempMenuItemQuantities[item.id] = 0;

      setMenuItemQuantities(tempMenuItemQuantities);
    }
  }

  // Listen to data change in firebase
  useEffect(() => {
    firebase.database().ref('/menuCategories').on("value", onMenuCategoryDataChange);
    firebase.database().ref('/menuItems').on("value", onMenuItemsDataChange);

    return () => {
      firebase.database().ref('/menuCategories').off("value", onMenuCategoryDataChange);
      firebase.database().ref('/menuItems').off("value", onMenuItemsDataChange);
    };
  }, []); 

  // Listen to change to selectedCategoryId
  useEffect(() => {
    filterMenuItems()
  }, [selectedCategoryId]);

  return(
    <View style={styles.container}>
      <Modal visible={modalOpen} animationType='slide'>
        <MaterialIcons
          name='close'
          size={24}
          onPress={()=>setModalOpen(false)}
        />
        <View>
        <Image
          source={{uri: selectedMenuItem.image}}
          style={{width:400, height:200}}
        />

        <View style={styles.cardContent}>
              <View>
                <Text style={styles.cardTitle}>{selectedMenuItem.menuItemName}</Text>
                <Text style={styles.cardSubtitle}>{selectedMenuItem.price}</Text>
              </View>
              <View style={styles.cardContentAdd}>
                <View style={styles.spinnerContainer}>
                  <InputSpinner
                    initialValue = {menuItemQuantities[selectedMenuItem.id]}
                    value = {menuItemQuantities[selectedMenuItem.id]}
                    step={1}
                    color = 'black'
                    colorPress = '#EAEAEA'
                    height = {28}
                    width = {95}
                    showBorder = {true}
                    rounded={false}
                    buttonFontSize = {16}
                    onChange = {(num) => {
                      let tempMenuItemQuantities = {};
  
                      for (const id in menuItemQuantities){
                        tempMenuItemQuantities[id] = menuItemQuantities[id];
                      }
                      tempMenuItemQuantities[selectedMenuItem.id] = num;
  
                      setMenuItemQuantities(tempMenuItemQuantities);
                    }}
                  /> 
                </View>
                <TouchableOpacity
                  style={styles.cardButton}
                  underlayColor='#fff'
                  onPress={() => {
                    addMenuItemQuantity(selectedMenuItem);
                  }}
                >
                    <Text style={styles.cardButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={styles.cardSubtitle}>{selectedMenuItem.description}</Text>
            </View>
          </View>
      </Modal>

      {/* Categories list */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal={true}
          data={menuCategories}
          renderItem={({item}) => {
            if(item.id == selectedCategoryId){
              return(
              <TouchableOpacity
                style={styles.categoryItemSelected}
                underlayColor='#fff'
                onPress={() => {
                  setSelectedCategoryId(item.id);
                }}
              >
                  <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
              )
            }
            else{
              return(
              <TouchableOpacity
                style={styles.categoryItem}
                underlayColor='#fff'
                onPress={() => {
                  setSelectedCategoryId(item.id);
                }}
              >
                  <Text style={styles.categoryTextSelected}>{item.name}</Text>
              </TouchableOpacity>
              )
            }
          }}
        />
      </View>

      {/* Menu items list */}
      <FlatList data={displayedMenuItems} renderItem = {({item}) => (
        <TouchableOpacity style={styles.card}
          onPress={() => {
            setModalOpen(true);

            setSelectedMenuItem(item);
          }}
        >
          <Image style={styles.cardImage} source={{ uri: item.image }}></Image>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle}>{item.menuItemName}</Text>
              <Text style={styles.cardSubtitle}>€{item.price}</Text>
            </View>
            <View style={styles.cardContentAdd}>
              <View style={styles.spinnerContainer}>
                <InputSpinner
                  initialValue = {menuItemQuantities[item.id]}
                  value = {menuItemQuantities[item.id]}
                  step={1}
                  color = 'black'
                  colorPress = '#EAEAEA'
                  height = {28}
                  width = {95}
                  showBorder = {true}
                  rounded={false}
                  buttonFontSize = {16}
                  onChange = {(num) => {
                    let tempMenuItemQuantities = {};

                    for (const id in menuItemQuantities){
                      tempMenuItemQuantities[id] = menuItemQuantities[id];
                    }
                    tempMenuItemQuantities[item.id] = num;

                    setMenuItemQuantities(tempMenuItemQuantities);
                  }}
                /> 
              </View>
              <TouchableOpacity
                style={styles.cardButton}
                underlayColor='#fff'
                onPress={() => {
                  addMenuItemQuantity(item);
                }}
              >
                  <Text style={styles.cardButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity> 
      )} />
    </View>
  );
};

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    marginBottom: 30,
    justifyContent: 'center'
  },
  card:{
    backgroundColor: '#FFF',
    marginBottom:20,
    marginLeft: '2%',
    width: '95%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderRadius: 7,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cardContentAdd: {
    // backgroundColor: 'gold',
    flexDirection: 'row',
    alignItems: 'flex-end'
    // flexDirection: 'column-reverse'
  },
  cardButton: {
    height: 30,
    marginRight:10,
    marginLeft:5,
    marginTop: 15,
    marginBottom: 11,
    paddingHorizontal: 12,
    paddingVertical: 4,
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
  categoryItem:{
    marginRight:5,
    marginLeft:5,
    // marginTop: 0,
    marginBottom: 10,
    padding: 7,
    backgroundColor:'#E0E0E0',
    borderRadius:10,
    borderWidth: 0
  },
  categoryItemSelected:{
    marginRight:5,
    marginLeft:5,
    // marginTop: 0,
    marginBottom: 10,
    padding: 7,
    backgroundColor:'black',
    borderRadius:10,
    borderWidth: 0
  },
  categoryText:{
      color:'#fff',
      textAlign:'center',
      fontSize: 16
  },
  categoryTextSelected:{
    color:'black',
    textAlign:'center',
    fontSize: 16
  },
  categoriesContainer:{
    marginHorizontal: 5,
    // backgroundColor: "red"
  },
  spinnerContainer:{
    marginBottom: 12,
    height: 28
  }
});

export default Menu;
