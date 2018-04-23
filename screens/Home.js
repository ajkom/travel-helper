import React from 'react';
import { View, StyleSheet, Alert, FlatList, Dimensions, Picker, Image, StatusBar } from 'react-native';
import { Button, FormInput, FormLabel, Text, Icon } from 'react-native-elements';
import { Location, Permissions } from 'expo';


export default class Home extends React.Component {

  static navigationOptions = {
    title: 'Welcome to Travel Helper!',
    tabBarLabel: 'Home',
    tabBarIcon: ({tintColor}) => <Icon name='home' color={tintColor} />
  };

  constructor(props) {
    super(props);
    this.state = {
      latitude:'',
      longitude:'',
      tempr:'',
      descr:'',
      weather:null,
      keyword: 'cafe'
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

    try {
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
    } catch (err) {
      console.log(err);
    }

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
        <StatusBar hidden={true} />
        <Text h4 style={{fontWeight: 'bold', fontSize: 18, marginTop:10, color: '#5e6977'}}>Weather today{'\n'}</Text>

        <Text style={styles.weatherText}>{weather.main.temp}°C, {weather.weather[0].description}</Text>
        <Text style={styles.weatherText}>Wind: {weather.wind.speed} m/s</Text>
        <Image
          source={{uri: iconurl}}
          style={{width: 60, height: 60}}
        />

        <Button raised rounded
          rightIcon={{ name: "search" }}
          onPress={() => navigate('Finder', {lat: this.state.latitude, lon: this.state.longitude, keyword: this.state.keyword})}
          title="FIND NEARBY"
          buttonStyle={{
            width: 200,
            backgroundColor:'#5d737e',
          }}
        />

        <FormLabel labelStyle={{fontSize:16}}>{"I'm looking for"} </FormLabel>
        <Picker
          selectedValue={this.state.keyword}
          style={{ height: 30, width: 300 }}
          onValueChange={(itemValue, itemIndex) => this.setState({keyword: itemValue})}>
          <Picker.Item label="Cafes" value="cafe" />
          <Picker.Item label="Restaurants" value="restaurant"/>
          <Picker.Item label="Stores" value="store"/>
          <Picker.Item label="Hospitals" value="hospital"/>
          <Picker.Item label="Night clubs" value="night_club"/>
          <Picker.Item label="Bars" value="bar"/>
          <Picker.Item label="Art galleries" value="art_gallery"/>
          <Picker.Item label="Churches" value="church"/>
          <Picker.Item label="Shopping malls" value="shopping_mall"/>
          <Picker.Item label="Post offices" value="post_office"/>
        </Picker>

      </View>



    )
  }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fcfcfc',
      alignItems: 'center',
      //justifyContent: 'center',
    },
    weatherText: {
      fontSize:18,
      color: '#2d2d2d'
    }
});
