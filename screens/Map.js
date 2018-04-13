import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, KeyboardAvoidingView} from 'react-native';
import { MapView } from 'expo';
import {StackNavigator} from 'react-navigation';

export default class Map extends React.Component {

  static navigationOptions = {title: 'Map'};

  constructor(props) {
    super(props);

    this.state = {
        location: '',
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
        title: ''
      }

}

componentDidMount() {
  const { params } = this.props.navigation.state;
  const address = params.address;

  this.fetchAddress(address);
}

  fetchAddress = (address) => {
    const key = 'AIzaSyClulqjPepQjs9IWY8qfUlcUIHeFyr_2Ys';
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key='+key;

    fetch(url)
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                location: responseData.results[0].formatted_address,
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

  render() {
    return (

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



    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
