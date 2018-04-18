import React from 'react';
import {View, StyleSheet, Text, Alert, FlatList, Dimensions, Image} from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import { Location, Permissions } from 'expo';


export default class Home extends React.Component {
  static navigationOptions = {title: 'Home'};


  constructor(props) {
    super(props);
    this.state = {
      latitude:'',
      longitude:'',
      tempr:'',
      descr:'',
      weather:null
    };

    this.fetchWeather.bind(this);
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
      this.fetchWeather();
    }
  };

  fetchWeather = () => {
    let lat = this.state.latitude;
    let lon = this.state.longitude;
    const API = 'APPID=983d8b821c4bb020e04735abd342e5c2'
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat}&lon=${lon}&${API}`;

    fetch(url)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          weather: responseData
        })
      })
      .catch((error) => {
        Alert.alert(error);
      })

      console.log(this.state.weather.weather[0].icon)
  }


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
    const { navigate } = this.props.navigation;
    // prevent page from loading before weather info is fetched
    if (this.state.weather == null)
      return null;

    // get the window width value
    let width = Dimensions.get('window').width;

    //weather
    let weather = this.state.weather;
    let iconurl = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;

    return(
      <View style={styles.container}>
      <Text>Weather today</Text>

      <Text>{weather.main.temp}°C, {weather.weather[0].description}</Text>
      <Text>Wind: {weather.wind.speed} m/s</Text>
      <Image
        source={{uri: iconurl}}
        style={{width: 60, height: 60}}
      />


      <Button raised
        onPress={() => navigate('Finder', {lat: this.state.latitude, lon: this.state.longitude})}
        title="Find nearby"
        buttonStyle={{width: width, backgroundColor:'peru', marginBottom:'2%'}}
      />


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
