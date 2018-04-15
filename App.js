import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';


import MyPlaces from './screens/MyPlaces.js';
import Map from './screens/Map.js';
import Home from './screens/Home.js';
import Expenses from './screens/Expenses.js';
import Diary from './screens/Diary.js';


import Currency from './screens/home/Currency.js';
import Finder from './screens/home/Finder.js';

const Stack = StackNavigator({
  Currency: {screen: Currency},
  Finder: {screen: Finder}
});




const MyApp = TabNavigator({
  Home: {screen: Home},
  MyPlaces: {screen: MyPlaces},
  Map: {screen: Map},
  Expenses: {screen: Expenses},
  Diary: {screen: Diary}
}, {
  animationEnabled: true,
})




export default class App extends React.Component {
  render() {
    return <MyApp />
  }
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
