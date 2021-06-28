import { database } from 'firebase';
import * as React from 'react';
import {
  SafeAreaView, StatusBar, FlatList,
  TouchableOpacity, Text, View, Image, StyleSheet, TextInput
} from 'react-native';
import { or } from 'react-native-reanimated';

import { firebase } from '../src/firebase/config';

export default class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      yourOrders: [],
      email: '',
      isCorrect: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    firebase.database().ref("orders").on("value", (snapshot) => {
      if (snapshot.val() != null) {
        this.setState({ orders: snapshot.val() })
        //console.log(this.state.orders)
      }
    })

  }
  handleChange(text) {
    this.setState({ email: text });
    //console.log(this.state.email)
  }
  handleSubmit() {
    let tempOrders = [];
    var existing = false;

    Object.keys(this.state.orders).map((id) => {
      if (this.state.orders[id].consumer == this.state.email) {
        var order = {};
        order["id"] = this.state.orders[id].id;
        order["date"] = this.state.orders[id].date;
        order["finished"] = this.state.orders[id].finished;
        order["totalPrice"] = this.state.orders[id].totalPrice;
        tempOrders.push(order)
        existing = true;
        //console.log(order)
        //console.log(tempOrders)
      }
    })
    if (existing == true) {
      this.setState({ isCorrect: true });
      this.setState({ yourOrders: tempOrders });
      //console.log(this.state.yourOrders)
    } else {
      this.setState({ isCorrect: false });
    }
    //console.log(this.state.isCorrect)
  }
  render() {
    return (
      <View style={{ marginTop: 15, marginBottom: 30, justifyContent: 'center' }}>

        <Text style={{ marginTop: 30, fontSize: 20, alignSelf: "center" }}>
          Please enter your email to continue.
        </Text>
        <View style={{
          flexDirection: "row",
          alignItems: "flex-start",
          marginHorizontal: 40,
          borderWidth: 2,
          marginTop: 40,
          //paddingHorizontal: 10,
          borderColor: "#000000",
          borderRadius: 23,
          paddingVertical: 2
        }}>
          <TextInput
            style={{paddingVertical: 8,
              paddingHorizontal:12,}}
            placeholder="Email Address"
            value={this.state.email}
            onChangeText={this.handleChange}
          />
          <Text
            onPress={this.handleSubmit}
            style={{
              color: "white",
              backgroundColor:"black",
              marginVertical:2,
              borderRadius: 23,
              paddingVertical: 10,
              paddingHorizontal:12,
              marginHorizontal:120,
              alignItems:"flex-end",
              justifyContent:"flex-end"
            }}>Check</Text>
        </View>

        {this.state.isCorrect == true &&
          <SafeAreaView style={{ marginTop: 30 }}>


            <FlatList
              data={this.state.yourOrders}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card}>
                  <View style={styles.cardContent}>
                    <View >
                      <Text style={styles.cardTitle}>ID: {item.id}</Text>
                      <Text style={styles.cardTitle}>Order Finished: {String(item.finished)}</Text>
                      <View>
                        <View style={[{ flex: 1, flexDirection: 'row' }]}>
                          <Text style={styles.cardTitle}>Date: {item.date}</Text>
                        </View>
                        <View style={[{ justifyContent: 'space-evenly', marginVertical: 5 }]}>
                          <Text style={styles.cardTitle}>Price: €{item.totalPrice}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        }
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 4,
    margin: 10,
  },
  card: {
    backgroundColor: '#FFF',
    marginBottom: 12,
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
    justifyContent: 'flex-start'
  },
  cardContentAdd: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  cardTitle: {
    marginTop: 7,
    marginBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    fontWeight: 'bold'
  },
  cardSubtitle: {
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
    fontSize: 16
  },
  orderListText: {
    marginTop: 7,
    marginBottom: 2,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
  },
  title: {
    fontSize: 32,
  },
  navigationText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    backgroundColor: "#b0adac",
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: "#000000",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#000000",
  },
});
