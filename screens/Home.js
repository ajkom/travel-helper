import React from 'react';
import {View, StyleSheet, Text, Alert, FlatList, Dimensions} from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import { Location, Permissions } from 'expo';




export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {latitude:'', longitude:'', myplaces: []};
  }

  componentDidMount() {
    this.getLocation();
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
      });
    }
  };

  showRestaurants = () => {
      let loc = this.state.latitude+','+this.state.longitude;
      let key = 'AIzaSyClulqjPepQjs9IWY8qfUlcUIHeFyr_2Ys';

      const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + loc+'&type=restaurant&radius=500&key='+key;

      fetch(url)
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({
            myplaces: responseData.results
          })
        })
        .catch((error) => {
          Alert.alert(error);
        })
  }

  showHotels = () => {
      let loc = this.state.latitude+','+this.state.longitude;
      let key = 'AIzaSyClulqjPepQjs9IWY8qfUlcUIHeFyr_2Ys';

      const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + loc+'&type=hotel&radius=500&key='+key;

      fetch(url)
        .then((response) => response.json())
        .then((responseData) => {
          this.setState({
            myplaces: responseData.results
          })
        })
        .catch((error) => {
          Alert.alert(error);
        })
  }



  renderItem =  ({item}) => {
    const { navigate } = this.props.navigation;
    return(
      <ListItem
        title={item.name}
        subtitle={item.rating}
        rightTitle={"on map"}
        onPress={() => navigate('Map', {address: item.address})}
        onLongPress={() => this.deleteItem(item.id)}
      />
    )
  }


  render() {
    let width = Dimensions.get('window').width;

    return(
      <View style={styles.container}>

      <Button raised
        onPress={this.showRestaurants}
        title="Restaurants nearby"
        buttonStyle={{width: width, backgroundColor:'peru', marginBottom:'2%'}} />
      <Button raised
        onPress={this.showHotels}
        title="Hotels nearby"
        buttonStyle={{width: width, backgroundColor:'teal'}} />

      <FlatList
        data={this.state.myplaces}
        keyExtractor={item => item.id}
        renderItem={this.renderItem}
        style={{width: width}}
      />







      </View>
      /*{
      }*/


    )
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