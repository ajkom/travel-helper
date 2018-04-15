import React, { Component } from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Expo, { SQLite } from 'expo';
import { FormInput, FormLabel, Button, List, ListItem } from 'react-native-elements';
/*import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';*/

const db = SQLite.openDatabase('mynotesdb.db');

export default class Diary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {date: '', place: '', note: '', mynotes: [], tableHead: []};
  }

  componentDidMount() {
    db.transaction(tx => {
      tx.executeSql('create table if not exists mynotes (id integer primary key not null, note text, date text, place text);');
    });
    this.updateList();
  }

  saveItem = () => {
    db.transaction(tx => {
        tx.executeSql('insert into mynotes (date, place, note) values (?, ?, ?)', [this.state.date, this.state.place, this.state.note]);
      }, null, this.updateList)
  }

  updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from mynotes', [], (_, { rows }) =>
        this.setState({mynotes: rows._array, date:'', place:'', note:'' })
      );
    });
  }

  deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from mynotes where id = ?;`, [id]);
      }, null, this.updateList
    )
  }






  render() {
    return (
      <View style={styles.container}>
        <Text>Hello World </Text>

        <Button onPress={this.saveItem} title="SAVE" />


        <FormLabel>DATE</FormLabel>
        <FormInput
          placeholder='date'
          onChangeText={(date) => this.setState({date})}
          value={this.state.date}/>

          <FormLabel>PLACE</FormLabel>
          <FormInput
            placeholder='place'
            onChangeText={(place) => this.setState({place})}
            value={this.state.place}/>

          <FormLabel>note </FormLabel>
          <FormInput multiline
            placeholder='notes'
            onChangeText={(note) => this.setState({note})}
            value={this.state.note}/>



      </View>
    )
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
    text: { margin: 6 }
});
