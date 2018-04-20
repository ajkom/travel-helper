import React from 'react';
import {View, StyleSheet, Text, Alert, FlatList, Dimensions, Image} from 'react-native';
import { Button, FormInput, } from 'react-native-elements';
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
      weather:null,
      keyword: ''
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
      <Text>Welcome to the Travel Helper!{'\n\n'}</Text>

      <Text>Weather today</Text>

      <Text>{weather.main.temp}°C, {weather.weather[0].description}</Text>
      <Text>Wind: {weather.wind.speed} m/s</Text>
      <Image
        source={{uri: iconurl}}
        style={{width: 60, height: 60}}
      />

      <FormInput placeholder='What are you looking for?'
        onChangeText={(keyword) => this.setState({keyword})}
        value={this.state.keyword}
      />


      <Button raised
        icon={{ name: "search" }}
        onPress={() => navigate('Finder', {lat: this.state.latitude, lon: this.state.longitude, keyword: this.state.keyword})}
        title="Find nearby"
        buttonStyle={{width: width, backgroundColor:'peru', marginBottom:'2%'}}
      />

      </View>



    )
  }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        //justifyContent: 'center',
    }
});
