import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	TextInput,
	ScrollView,
	Image,
	Button
} from 'react-native';

import SocketIOClient from 'socket.io-client';
import _ from 'lodash';
import axios from 'axios';

import hub from './hub';

class Auth extends Component {
    constructor(props){
        super(props);

        this.state = {
            age: '12',
            name: {
                first: 'Scott',
                last: 'Cho'
            },
            email: 'heyscott96@gmail.com',
            password: 'Somepwisthispw',
            message: 'yo',
            res: 'Did not send yet'
        }

        this.onSend = this.onSend.bind(this);
    }

    onSend() {
        hub.signup(this.state);
    }

    connectSocket() {

    }

    render() {
        return(
            <View style={styles.cellStyle}>
                <TextInput
                    value={this.state.age}
                    onChangeText={(age) => this.setState({age})}
                    style={styles.cellTextInputStyle}
                    placeholder={'age'}>
				</TextInput>
                <TextInput
                    value={this.state.name.first}
                    onChangeText={(firstName) => this.setState({name: {firstname}})}
                    style={styles.cellTextInputStyle}
                    placeholder={'first name'}>
				</TextInput>
                <TextInput
                    value={this.state.name.last}
                    onChangeText={(lastName) => this.setState({name: {lastName}})}
                    style={styles.cellTextInputStyle}
                    placeholder={'first name'}>
				</TextInput>
				<TextInput
                    value={this.state.email}
                    onChangeText={(email) => this.setState({email})}
                    style={styles.cellTextInputStyle}
                    placeholder={'email'}>
				</TextInput>
                <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({password})}
                    style={styles.cellTextInputStyle}
                    placeholder={'password'}>
                </TextInput>
                <TouchableOpacity onPress={() => this.onSend()}>
                    <Text>SEND</Text>
                </TouchableOpacity>
                <Text>{this.state.res}</Text>
			</View>
        )
    }
}

const styles = StyleSheet.create({
    cellStyle: {
        height: 50,
        width: 300,
        marginTop: 120
	},
    cellTextInputStyle: {
        height: 50,
        paddingLeft: 15,
        marginBottom: 5,
        borderWidth: 0.7,
        borderRadius: 3,
        fontWeight: '200',
        fontSize: 15
    },
})

export default Auth;
