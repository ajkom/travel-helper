import React, { Component } from 'react';
import {StyleSheet, View} from 'react-native';
import {StackNavigator, TabNavigator, TabBarBottom} from 'react-navigation';

import MyPlaces from './screens/MyPlaces.js';
import Map from './screens/Map.js';
import Home from './screens/Home.js';
import Expenses from './screens/Expenses.js';
import Diary from './screens/Diary.js';
import Finder from './screens/Finder.js';

import { YellowBox } from 'react-native';

// prevent annoying React warnings from showing in the app
  YellowBox.ignoreWarnings([
    'Warning: componentWillMount is deprecated',
    'Warning: componentWillReceiveProps is deprecated',
    'Warning: componentWillUpdate is deprecated'
  ]);


// navigation settings
const StackPlaces = StackNavigator({
  MyPlaces: {screen: MyPlaces},
  Map: {screen: Map},
}, {
  navigationOptions: {
  headerStyle: {
    backgroundColor: '#124559',
  },
  headerTitleStyle:{
    color: 'white'
  }}
});

const StackHome = StackNavigator({
  Home: {screen: Home},
  Finder: {screen: Finder},
}, {
  navigationOptions: {
  headerStyle: {
    backgroundColor: '#124559',
  },
  headerTitleStyle:{
    color: 'white'
  }}

});

const StackDiary = StackNavigator({
  Diary: {screen: Diary},
  }, {
    navigationOptions: {
    headerStyle: {
      backgroundColor: '#124559',
    },
    headerTitleStyle:{
      color: 'white'
    }}
})

const StackExpenses = StackNavigator({
  Expenses: {screen: Expenses}
}, {
  navigationOptions: {
    title: 'My expenses',
    headerStyle: {backgroundColor: '#124559'},
    headerTitleStyle:{color: 'white'}
  }})

// combine stack navigators into tabs
const MyApp = TabNavigator({
  StackHome: {screen: StackHome},
  StackPlaces: {screen: StackPlaces},
  StackExpenses: {screen:StackExpenses},
  StackDiary: {screen: StackDiary}
  },{
  animationEnabled: true,
  tabBarPosition: 'bottom',
  tabBarOptions: {
    showIcon: true,
    labelStyle: {
      fontSize: 12,
    },
    activeBackgroundColor: '#124559',
    inactiveBackgroundColor: '#01161e'
  },
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
