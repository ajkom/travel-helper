import React from 'react';
import {StyleSheet, Text, TextInput, View, FlatList, Alert, Dimensions} from 'react-native';
import { FormInput, Header, FormLabel, Button,  ListItem } from 'react-native-elements';
import Expo, { SQLite } from 'expo';
import DatePicker from 'react-native-datepicker'

const db = SQLite.openDatabase('moneydb.db');

export default class Expenses extends React.Component {
   static navigationOptions = {title: 'My expenses'};

  constructor(props) {
    super(props);
    this.state = {date: '', amount: '', category: '', shopping: []};
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql('create table if not exists money (id integer primary key not null, date date, amount text, category text);');
    });
    this.updateList();
  }

  saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into money (date, amount, category) values (?, ?, ?)', [this.state.date, this.state.amount, this.state.category]);
      }, null, this.updateList)
  }

  updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from money', [], (_, { rows }) =>
        this.setState({money: rows._array, date:'', amount:'', category:'' })
      );
    });
  }

  deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from money where id = ?;`, [id]);
      }, null, this.updateList
    )
  }

  renderItem =  ({item}) => (
    <ListItem
      subtitle={item.category}
      title={item.amount.toString()}
      rightTitle={item.date}
      onLongPress={() => this.deleteItem(item.id)}
    />
  )


  render() {
    let width = Dimensions.get('window').width;

    return (
      <View style={styles.container}>
        <View >

        <FormLabel>DATE</FormLabel>
        <DatePicker
          placeholder="select date"
          mode="date"
          date={this.state.date}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={(date) => this.setState({date})}
          style={{}}
        />

        <FormLabel>AMOUNT</FormLabel>
        <FormInput placeholder='Amount'
          onChangeText={(amount) => this.setState({amount})}
          value={this.state.amount}
          keyboardType='numeric'

        />

        <FormLabel>CATEGORY</FormLabel>
        <FormInput placeholder='I spent money on...'
          onChangeText={(category) => this.setState({category})}
          value={this.state.category}
        />

        <Button onPress={this.saveItem} title="SAVE" buttonStyle={{width: width}}/>


        <FlatList
          data={this.state.money}
          style={{width: width}}
          keyExtractor={item => item.id}
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '5%',
    },
    inputs: {
      backgroundColor:'red',
      position:"absolute",

    }
});
