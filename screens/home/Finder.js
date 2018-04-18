import React, { Component } from 'react';
import {View, Text, FlatList} from 'react-native';
import { FormInput, ListItem, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Finder extends React.Component {
  static navigationOptions = {title: 'Find nearby'};

  constructor(props){
    super(props);

    this.state={
      myplaces: [],
      searchItem: ''
    }
  }



  findPlaces = () => {
    const { params } = this.props.navigation.state;

    let loc = params.lat+','+params.lon;
    let apikey = 'AIzaSyClulqjPepQjs9IWY8qfUlcUIHeFyr_2Ys';
    let searchkey = this.state.searchItem;

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${loc}&type=${searchkey}&radius=500&key=${apikey}`;



    fetch(url)
      .then((response) => response.json())

      .then((responseData) => {
        this.setState({
          myplaces: responseData.results
        })
      })
      .then(console.log(this.state.myplaces))
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
    return (
      <View>


    <Text>Hello World 2</Text>

    <FormInput placeholder='Type in the key word'
      onChangeText={(searchItem) => this.setState({searchItem})}
      value={this.state.searchItem}/>

      <Button
        icon={{ name: "save" }}
        onPress={this.findPlaces}
        title="SAVE"
      />

    <FlatList
      data={this.state.myplaces}
      keyExtractor={item => item.id}
      renderItem={this.renderItem}
      style={{width:'100%'}}
    />


    </View>
  )}
}
