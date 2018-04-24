import React from 'react';
import { StyleSheet, Text, TextInput, View, Alert, KeyboardAvoidingView, Dimensions} from 'react-native';
import { Location, Permissions, MapView } from 'expo';
import {Icon, Button } from 'react-native-elements';

import {StackNavigator} from 'react-navigation';

export default class Map extends React.Component {

  static navigationOptions = {
    title: 'Map',
    tabBarLabel: 'Map',
    tabBarIcon: ({tintColor}) => <Icon type='foundation' name='map' color={tintColor} />
  };

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
            console.log(responseData)
        })
    .catch((error) => {
        Alert.alert(error);
    })
  }


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
            <TextInput
              onChangeText={(address) => this.setState({address})}
              placeholder= 'Where to?'
              style={styles.search}
            />

            <Button raised rounded
              onPress={this.search}
              buttonStyle={{
                backgroundColor:'white',
                padding: 10,
              //  bottom:0
                position: 'absolute',
                left:0
              }}
              icon={{name:"search", color:'#007AFF'}}
              />

            <Button raised rounded
              onPress={this.getLocation}
              buttonStyle={{
                backgroundColor:'white',
                //width: 50,
                padding: 10,
                position: 'absolute',
                right:0
              }}
              icon={{name:"my-location", color:'#007AFF'}}
            />

        </View>

    );
  }

}

    let width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfc',
  },
  search: {
  //  position: 'absolute',
  //  bottom:0,
    paddingLeft:'5%',
    height:40,
    margin: '5%',
    width: width*0.9,
    backgroundColor:'white',
    fontSize:16,
  },
});
