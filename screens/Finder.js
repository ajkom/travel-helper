import React, { Component } from 'react';
import {Alert, View, FlatList, StyleSheet} from 'react-native';
import { ListItem, Button, Icon, Text, FormLabel} from 'react-native-elements';
import {StackNavigator} from 'react-navigation';

export default class Finder extends React.Component {
  static navigationOptions = {
    title: 'Find nearby',
    tabBarLabel: 'Find nearby',
    tabBarIcon: ({tintColor}) => <Icon name='search' color={tintColor} />
  };

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
    let location = this.state.myplaces[0].geometry.location.lat +','+ this.state.myplaces[0].geometry.location.lng

    return(
      <ListItem
        title={
          <View>
          <Text style={{fontSize:16, paddingLeft: 10}}>{item.name}</Text>
          </View>
        }
        subtitle={`rating: ${item.rating}`}
        rightTitle={"on map"}
        subtitleStyle={{fontSize:14}}
        onPress={() => {navigate('Map', {address: location, name: this.state.myplaces[0].name})}}
        onLongPress={() => {navigate('MyPlaces', {item:item.name})} }
      />
    )
  }

  render() {
    const { params } = this.props.navigation.state;

    if (params == null) return null;

    return (
      <View style={styles.container}>

        <Text h4 style={{padding: 5 }}>{params.keyword.toUpperCase()}S AROUND YOU</Text>
        <FormLabel labelStyle={{fontSize:16, paddingBottom: 5}}>long-press to save to My Places</FormLabel>

        <FlatList
          data={this.state.myplaces}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
          style={{width:'100%'}}
        />
    </View>
  )}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f7f7f9',
      alignItems: 'center',
    },
});
