import React, { Component } from 'react';
import {Text, View, StyleSheet, Image, FlatList} from 'react-native';
import Expo, { SQLite } from 'expo';
import { FormInput, FormLabel, Button, ListItem} from 'react-native-elements';
import { Container, Header, Content, Card, CardItem, Body, DeckSwiper } from 'native-base';
import DatePicker from 'react-native-datepicker'


const db = SQLite.openDatabase('mynotesdb.db');

export default class Diary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      date: '',
      place: '',
      note: '',
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
        <View>
          <Card>
            <CardItem>
                <Body>
                  <Text onLongPress={() => this.deleteItem(item.id)}>{item.date}, {item.place}</Text>
                </Body>
            </CardItem>
            <CardItem cardBody>
              <Text>{item.note}</Text>
            </CardItem>
          </Card>
        </View>
      )
  }


  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.saveItem} title="SAVE" />


        <FormLabel>DATE</FormLabel>
        <DatePicker
          placeholder="select date"
          mode="date"
          format="DD-MM-YYYY"
          date={this.state.date}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={(date) => this.setState({date})}
          style={{}}
        />

          <FormLabel>PLACE</FormLabel>
          <FormInput
            placeholder='place'
            onChangeText={(place) => this.setState({place})}
            value={this.state.place}
          />

          <FormLabel>NOTES </FormLabel>
          <FormInput multiline
            placeholder='notes'
            onChangeText={(note) => this.setState({note})}
            value={this.state.note}
          />

          <FlatList
            data={this.state.mynotes}
            //style={{width: width}}
            keyExtractor={item => item.id}
            renderItem={this.renderItem}
          />

          {/*  <DeckSwiper style={{boderColor:'black', borderWidth:1}}
            dataSource={this.state.mynotes}
            key={item => item.id}
            renderItem={this.renderItem}
          />
*/}


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
