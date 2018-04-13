import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native';
import {DrawerNavigator} from 'react-navigation';

import MyPlaces from './screens/MyPlaces.js';
import Map from './screens/Map.js';
import Home from './screens/Home.js';
import Expenses from './screens/Expenses.js';


const MyApp = DrawerNavigator({
      Home: {screen: Home},
      MyPlaces: {screen: MyPlaces},
      Map: {screen: Map},
      Expenses: {screen: Expenses}, 
});

export default class App extends React.Component {
  render() {
    return <MyApp />;
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
