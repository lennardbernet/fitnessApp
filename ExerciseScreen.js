import React, {Component} from 'react';
import {Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DialogInput from 'react-native-dialog-input';
import Dialog, {DialogButton, DialogContent, DialogFooter} from "react-native-popup-dialog";
import * as firebase from "firebase";

export default class ExerciseScreen extends Component {
    static navigationOptions = {
        title: 'Workout exercises'
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            workout: "",
            showAddBool: false,
            showDeleteBool: false,
            selectedItem: ""
        }
    }

    getExercises = (url) => {
        fetch(url)
            .then(data => data.json())
            .then((data) => {
                let dataArray = [];
                for (var i = 0; i < data.length; i++) {
                    dataArray.push(data[i].name)
                }
                this.setState({data: dataArray})
            })
    };

    deleteExercise = () => {
        fetch('http://localhost:8080/jaxrs_war_exploded/v1/se/deleteExercise?exercise=' + this.state.selectedItem)
        let data = this.state.data;
        data.splice(data.indexOf(this.state.selectedItem));
        this.setState({data: data, showDeleteBool: false})
    };

    addExercise(inputText) {
        let data = this.state.data;
        let bool = false;
        data.forEach((d) => {
            if(d === inputText){
                bool = true;
            }
        })
        if (bool === false) {
            fetch('http://localhost:8080/jaxrs_war_exploded/v1/se/insertExercise?exercise=' + inputText)
            data.push(inputText);
        }
        this.setState({data: data, showAddBool: false})
    }

    showAdd = (boolean) => {
        this.setState({showAddBool: boolean})
    };

    removeExercise = (item) => {
        this.setState({showDeleteBool: true, selectedItem: item})
    };

    showDelete = (boolean) => {
        this.setState({showDeleteBool: boolean})
    };

    showDetails = (item) => {
        const {navigate} = this.props.navigation;
        navigate('Detail', {exercise: this.state.workout + "/" + item})
    };

    componentDidMount() {
        this.setState({workout: this.props.navigation.getParam('workout')});
        this.getExercises('http://localhost:8080/jaxrs_war_exploded/v1/se/getExercises?workout=' + this.props.navigation.getParam('workout'));
    }

    render() {
        return (
            <ScrollView>
                <View style={{flex: 1}}>
                    <Button title="Übung hinzufügen"
                            onPress={() => this.showAdd(true)}
                    />
                    <FlatList
                        data={this.state.data}
                        keyExtractor={item => item}
                        renderItem={({item}) =>
                            <TouchableOpacity
                                onPress={() => this.showDetails(item)}
                                onLongPress={() => this.removeExercise(item)}>
                                <Text style={styles.item}>{item}</Text>
                            </TouchableOpacity>}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                    <DialogInput isDialogVisible={this.state.showAddBool}
                                 title={"Übung hinzufügen"}
                                 hintInput={"Übungsname"}
                                 submitInput={(inputText) => {
                                     this.addExercise(inputText)
                                 }}
                                 closeDialog={() => this.showAdd(false)}>
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
                                    onPress={() => this.deleteExercise()}
                                />
                            </DialogFooter>
                        }>
                        <DialogContent>
                            <Text>Wollen sie diese Übung wirklich löschen?</Text>
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
    sets: {
        padding: 10
    },
    item: {
        backgroundColor: '#d1d1cf',
        padding: 10,
        fontSize: 18,
        height: 44,
    },
});
