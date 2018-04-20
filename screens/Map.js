import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, KeyboardAvoidingView} from 'react-native';
import { Location, Permissions, MapView } from 'expo';

import {StackNavigator} from 'react-navigation';

export default class Map extends React.Component {

  static navigationOptions = {title: 'Map'};

  constructor(props) {
    super(props);

    this.state = {
          address: '',
          latitude: 0,
          longitude: 0,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221,
          title: '',
    };
}

componentDidMount() {

  const { params } = this.props.navigation.state;
/*  const address = params.address;
  this.fetchAddress(address);

/*  try {
    const address = params.address;
    this.fetchAddress(address);
  }
  catch (error) {
    this.getLocation();
  }
*/

  //if (params != null) {
    const address = params.address;
    this.fetchAddress(address);
  //}

  /*else {
    this.getLocation();
  }*/

}

  fetchAddress = (address) => {
    const key = 'AIzaSyClulqjPepQjs9IWY8qfUlcUIHeFyr_2Ys';
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key='+key;

    fetch(url)
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                address: responseData.results[0].formatted_address,
                title: responseData.results[0].formatted_address,
                latitude: responseData.results[0].geometry.location.lat,
                longitude: responseData.results[0].geometry.location.lng,
                latitudeDelta: responseData.results[0].geometry.viewport.northeast.lat - responseData.results[0].geometry.viewport.southwest.lat,
                longitudeDelta: responseData.results[0].geometry.viewport.northeast.lng - responseData.results[0].geometry.viewport.southwest.lng,
            })
        })
    .catch((error) => {
        Alert.alert(error);
    })

    //this.resetState;
  }

  getLocation = async () => {
    //Check permission
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      Alert.alert('No permission to access location');
    }
    else {
      let location = await Location.getCurrentPositionAsync({enableHighAccuracy:false});
      this.setState({

        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        //address: location.coords.formatted_address,
        title: "You are here"
      });
    }
  };

  search = () => {
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
    this.state.address + '?&key=AIzaSyClulqjPepQjs9IWY8qfUlcUIHeFyr_2Ys';
    fetch(url)
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                address: responseData.results[0].formatted_address,
                title: responseData.results[0].formatted_address,
                latitude: responseData.results[0].geometry.location.lat,
                longitude: responseData.results[0].geometry.location.lng,
                latitudeDelta: responseData.results[0].geometry.viewport.northeast.lat - responseData.results[0].geometry.viewport.southwest.lat,
                longitudeDelta: responseData.results[0].geometry.viewport.northeast.lng - responseData.results[0].geometry.viewport.southwest.lng,
            })
        })
    .catch((error) => {
        Alert.alert(error);
    })
  }

/*  getInitialState = () => {
     const initialState = {
           address: '',
           latitude: 0,
           longitude: 0,
           latitudeDelta: 0.0322,
           longitudeDelta: 0.0221,
           title: '',
     };
     return initialState;
 }

  resetState = () => {
     this.setState(this.getInitialState());
  }*/


  render() {
    return (
      <View style={styles.container}>
        <MapView
            style={{ left:0, right: 0, top:0, bottom: 0, position: 'absolute' }}
            region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: this.state.latitudeDelta,
                longitudeDelta: this.state.longitudeDelta,
            }}>

            <MapView.Marker coordinate={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
            }}
              title={this.state.title}/>
          </MapView>
          <KeyboardAvoidingView behavior="padding" style={styles.search}>
            <TextInput
              //value={this.state.address}
              onChangeText={(address) => this.setState({address})}
              placeholder= 'Where to?'
              style={{
                height:40,
                backgroundColor:'white',
              }}
            />

            <Button onPress={this.search} title="SHOW" />
            <Button onPress={this.getLocation} title="MY LOCATION" />
          </KeyboardAvoidingView>
</View>

    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
  position: 'absolute',
  bottom:5,
  width: 300,
},
});
