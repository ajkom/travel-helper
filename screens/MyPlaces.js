import React from 'react';
import {StatusBar, StyleSheet, View, FlatList,  Dimensions} from 'react-native';
import Expo, { SQLite } from 'expo';
import {StackNavigator} from 'react-navigation';
import { FormInput, Header, FormLabel, Button, List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

const db = SQLite.openDatabase('myplacesdb.db');

export default class MyPlaces extends React.Component {
  static navigationOptions = {title: 'My places'};

  constructor(props) {
    super(props);
    this.state = {address: '', myplaces: []};

  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql('create table if not exists myplaces (id integer primary key not null, address text);');
    });
    this.updateList();
  }

  saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into myplaces (address) values (?)', [this.state.address]);
      }, null, this.updateList)
  }

  updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from myplaces', [], (_, { rows }) =>
        this.setState({myplaces: rows._array, address:''})
      );
    });
  }

  deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from myplaces where id = ?;`, [id]);
      }, null, this.updateList
    )
  }

  renderItem =  ({item}) => {
    const { navigate } = this.props.navigation;
    return(
      <ListItem
        title={item.address}
        rightTitle={"show on map"}
        onPress={() => navigate('Map', {address: item.address})}
        onLongPress={() => this.deleteItem(item.id)}
      />
)
}


  listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  render() {
    let width = Dimensions.get('window').width;

    return (
      <View style={styles.container}>
        <View style={styles.container}>

          <FormLabel>PLACEFINDER</FormLabel>
          <FormInput placeholder='Type in address or place'
            onChangeText={(address) => this.setState({address})}
            value={this.state.address}/>

          <Button
            icon={{ name: "save" }}
            onPress={this.saveItem}
            title="SAVE"
            buttonStyle={{width: width}}
          />

          <FlatList
            data={this.state.myplaces}
            style={{width: width}}
            keyExtractor={item => item.id}
            renderItem={this.renderItem}
            ItemSeparatorComponent={this.listSeparator}
          />

          </View>

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
    }
});
