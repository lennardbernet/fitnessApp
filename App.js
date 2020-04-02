import React, {Component} from "react";
import {StyleSheet} from 'react-native';
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import ExerciseScreen from "./ExerciseScreen";
import DetailScreen from "./DetailScreen";
import WorkoutScreen from "./WorkoutScreen";


const AppNavigator = createStackNavigator({
  Home: WorkoutScreen,
  Exercise:ExerciseScreen,
  Detail:DetailScreen
});

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {

  render() {
    console.log(">>> App/render");
    return (
        <AppContainer/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});