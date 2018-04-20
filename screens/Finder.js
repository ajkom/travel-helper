import React, { Component } from 'react';
import {View, Text, FlatList} from 'react-native';
import {  ListItem, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StackNavigator} from 'react-navigation';



export default class Finder extends React.Component {
  static navigationOptions = {title: 'Find nearby'};

  constructor(props){
    super(props);

    this.state={
      myplaces: [],
    }
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    let keyword = params.keyword.toLowerCase();
    let location = params.lat+','+params.lon;

    console.log(keyword);

    this.findPlaces(keyword, location);
  }



  findPlaces = (searchkey, location) => {
    const apikey = 'AIzaSyClulqjPepQjs9IWY8qfUlcUIHeFyr_2Ys';

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&type=${searchkey}&radius=500&key=${apikey}`;


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
      />
    )
  }


  render() {
    return (
      <View>


    <Text>{this.props.navigation.state.keyword} nearby</Text>

    <FlatList
      data={this.state.myplaces}
      keyExtractor={item => item.id}
      renderItem={this.renderItem}
      style={{width:'100%'}}
    />


    </View>
  )}
}
