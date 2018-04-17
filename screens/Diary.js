import React, { Component } from 'react';
import {Text, View, StyleSheet, FlatList} from 'react-native';
import Expo, { SQLite } from 'expo';
import { FormInput, FormLabel, Button, ListItem, Card } from 'react-native-elements';
/*import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';*/

const db = SQLite.openDatabase('mynotesdb.db');

export default class Diary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    //  note:{
        date: '',
        place: '',
        note: '',
  //    },
      mynotes: []
      };
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
      }, null, this.updateList);
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

  renderItem =  ({item}) => {
    return(
      <Card>
      {
        this.state.mynotes.map((n, i) => {
          return(
            <View key={i}>
              <Text>{n.date}, {n.place}:{"\n\n"}{n.note}</Text>
            </View>
            );
          })
      }
      </Card>
  )
}




  render() {
    return (
      <View style={styles.container}>
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

          <Text></Text>

          <FlatList
              data={this.state.mynotes}
              //style={{width: width}}
              keyExtractor={item => item.id}
              renderItem={this.renderItem}
            //  <Text onPress={() => this.deleteItem(item.id)}>bought</Text>
              //ItemSeparatorComponent={this.listSeparator}
            />






      </View>
    )
  }
}

const styles = StyleSheet.create({
    /*container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '5%',
    },*/
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 }
});
