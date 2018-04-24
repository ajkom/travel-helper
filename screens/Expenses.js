import React from 'react';
import {StyleSheet, Text, TextInput, View, FlatList, Alert, Dimensions} from 'react-native';
import { FormInput, Header, FormLabel, Button, Icon, ListItem } from 'react-native-elements';
import Expo, { SQLite } from 'expo';
import DatePicker from 'react-native-datepicker';
import SlidingUpPanel from 'rn-sliding-up-panel';

const db = SQLite.openDatabase('moneydb.db');

export default class Expenses extends React.Component {

   static navigationOptions = {

     tabBarLabel: 'My expenses',
     tabBarIcon: ({tintColor}) => <Icon type='font-awesome' name='money' color={tintColor} />
   };

  constructor(props) {
    super(props);
    this.state = {
      date: '',
      amount: '',
      category: '',
      shopping: [],
      panelVisible: false,
    };
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

      this.setState({panelVisible: false})
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
      title={item.amount}
      titleStyle={{fontSize:16}}
      subtitleStyle={{fontSize:14}}
      subtitle={item.category}
      rightTitle={item.date}
      hideChevron
      onLongPress={() => this.deleteItem(item.id)}
    />
  )


  render() {
    let width = Dimensions.get('window').width;

    return (
      <View style={styles.container}>

      <Button raised title='ADD'
        onPress={() => this.setState({panelVisible: true})}
         rightIcon={{name:'add'}}
         buttonStyle={{
           width: width,
           backgroundColor:'#79b473'
         }}
      />

      <FlatList
        data={this.state.money}
        style={{width: width}}
        keyExtractor={item => item.id.toString()}
        renderItem={this.renderItem}
      />

      <SlidingUpPanel
        visible={this.state.panelVisible}
        onRequestClose={() => this.setState({panelVisible: false})}>

        <View style={styles.container}>

        <FormLabel labelStyle={styles.label}>CATEGORY</FormLabel>
        <FormInput placeholder='I spent money on...'
          onChangeText={(category) => this.setState({category})}
          value={this.state.category}
          inputStyle={styles.input}
        />

        <FormLabel labelStyle={styles.label}>DATE</FormLabel>
        <DatePicker
          style={{
            width:width,
            padding: 0,
            margin: 0,
          }}
          placeholder="When?"
          mode="date"
          date={this.state.date}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          showIcon={false}
          onDateChange={(date) => this.setState({date})}
          customStyles={{
            placeholderText:{
              color: '#86939e',
              fontSize: 16
            },
            dateInput: {
              borderWidth:0,
              borderBottomWidth: 1
            },
            dateText:styles.input
          }}
        />

        <FormLabel labelStyle={styles.label}>AMOUNT</FormLabel>
        <FormInput placeholder='How much?'
          onChangeText={(amount) => this.setState({amount:amount.toString()})}
          value={this.state.amount.toString()}
          keyboardType='numeric'
          inputStyle={styles.input}
        />

        <Button raised
          onPress={this.saveItem}
          title="SAVE"
          buttonStyle={{
            width: width,
            backgroundColor:'#79b473'
           }}
          rightIcon={{ name: "save" }}
        />

        </View>
      </SlidingUpPanel>
      </View>
    );
  }


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fbfbfc',
      alignItems: 'center',
      //justifyContent: 'center',
      //margin: '2%',
    },
    label: {
      fontSize:16,
    },
    input: {
      fontSize:16,
      textAlign: 'center',
      color: '#86939e'
    //  margin:0
    }
});
