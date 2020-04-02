import React, {Component} from 'react';
import {Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DialogInput from "react-native-dialog-input";
import Dialog, {DialogButton, DialogContent, DialogFooter} from 'react-native-popup-dialog';
import * as firebase from "firebase";

export default class WorkoutScreen extends Component {
    static navigationOptions = {
        title: 'Workouts',
    };

    constructor() {
        super();
        this.state = {
            data: [],
            showAddBool: false,
            showDeleteBool: false,
            selectedItem: ""
        }
    }

    getWorkout = (url) => {
        fetch(url)
            .then(data => data.json())
            .then((data) => {
                let dataArray = [];
                for (let i = 0; i < data.length; i++) {
                    dataArray.push(data[i].name)
                }
                this.setState({data: dataArray})
            })
    };

    addWorkout(inputText) {
        let data = this.state.data;
        let bool = false;
        data.forEach((d) => {
            if (d === inputText) {
                bool = true;
            }
        })
        if (bool === false) {
            fetch('http://localhost:8080/jaxrs_war_exploded/v1/se/insertWorkout?workout=' + inputText)
            data.push(inputText);
        }
        this.setState({data: data, showAddBool: false})
    }

    deleteWorkout = () => {
        fetch('http://localhost:8080/jaxrs_war_exploded/v1/se/deleteWorkout?exercise=' + this.state.selectedItem)
        let data = this.state.data;
        data.splice(data.indexOf(this.state.selectedItem));
        this.setState({data: data, showDeleteBool: false})
    };

    showAdd = (boolean) => {
        this.setState({showAddBool: boolean})
    };

    showDelete = (boolean) => {
        this.setState({showDeleteBool: boolean})
    };

    removeWorkout = (item) => {
        this.setState({showDeleteBool: true, selectedItem: item})
    };

    showWorkout = (item) => {
        const {navigate} = this.props.navigation;
        navigate('Exercise', {workout: item})
    };

    componentDidMount() {
        this.getWorkout('http://localhost:8080/jaxrs_war_exploded/v1/se/getExercises')
    }

    render() {
        return (
            <ScrollView>
                <View style={{flex: 1}}>
                    <Button title="Workout hinzufügen"
                            onPress={() => this.showAdd(true)}
                    />
                    <FlatList
                        data={this.state.data}
                        keyExtractor={item => item}
                        renderItem={({item}) =>
                            <TouchableOpacity
                                onPress={() => this.showWorkout(item)}
                                onLongPress={() => this.removeWorkout(item.toString())}>
                                <Text style={styles.item}>{item}</Text>
                            </TouchableOpacity>}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                    <DialogInput isDialogVisible={this.state.showAddBool}
                                 title={"Workout hinzufügen"}
                                 hintInput={"Workoutname"}
                                 submitInput={(inputText) => this.addWorkout(inputText)}
                                 closeDialog={() => {
                                     this.showAdd(false)
                                 }}>
                    </DialogInput>
                    <Dialog
                        visible={this.state.showDeleteBool}
                        footer={
                            <DialogFooter>
                                <DialogButton
                                    text="CANCEL"
                                    onPress={() => this.showDelete(false)}
                                />
                                <DialogButton
                                    text="OK"
                                    onPress={() => this.deleteWorkout()}
                                />
                            </DialogFooter>
                        }>
                        <DialogContent>
                            <Text>Wollen sie dieses Workout wirklich löschen?</Text>
                        </DialogContent>
                    </Dialog>
                </View>
            </ScrollView>
        );
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#000",
                }}
            />
        );
    };
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#d1d1cf',
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});
