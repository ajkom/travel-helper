import React from 'react';
import { Text, StatusBar, StyleSheet, View, FlatList,  Dimensions} from 'react-native';
import Expo, { SQLite } from 'expo';
import { FormInput, Header, FormLabel, Button, List, ListItem, Icon } from 'react-native-elements';

const db = SQLite.openDatabase('myplacesdb.db');

export default class MyPlaces extends React.Component {
  static navigationOptions = {
    title: 'My places',
    tabBarLabel: 'My places',
    tabBarIcon: ({tintColor}) => <Icon name='place' color={tintColor} />
  };

  constructor(props) {
    super(props);
    this.state = {address: '', myplaces: []};
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql('create table if not exists myplaces (id integer primary key not null, address text);');
    });

    const { params } = this.props.navigation.state;

    // if user is navigating from Finder page, save the parameter before updating the list
    if (params != null) {
      let address = params.item;
      this.setState({address});
      this.saveItem();
    } else {
      this.updateList();
    }
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
        title={
          <View>
          <Text style={{fontSize:16, paddingLeft: 10}}>{item.address}</Text>
          </View>
        }
        rightTitle={"show on map"}
        subtitleStyle={{fontSize:14}}
        onPress={() => navigate('Map', {address: item.address})}
        onLongPress={() => this.deleteItem(item.id)}
      />
  )}


  render() {
    let width = Dimensions.get('window').width;

    return (
      <View style={styles.container}>
        <View style={styles.container}>

          <FormLabel labelStyle={{fontSize:16}}>PLACEFINDER</FormLabel>
          <FormInput placeholder='Type in address or place'
            onChangeText={(address) => this.setState({address})}
            value={this.state.address}
            inputStyle={{
              fontSize:16,
              textAlign: 'center'}}
          />

          <Button raised
            rightIcon={{ name: "save" }}
            onPress={this.saveItem}
            title="SAVE"
            buttonStyle={{
              width: width,
              backgroundColor:'#79b473'
             }}
          />

          <FlatList
            data={this.state.myplaces}
            style={{width: width}}
            keyExtractor={item => item.id.toString()}
            renderItem={this.renderItem}
          />

          </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fbfbfc',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
