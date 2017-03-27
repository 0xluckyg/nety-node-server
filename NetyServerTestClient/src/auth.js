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

        this.onSignup = this.onSignup.bind(this);
		this.onLogin = this.onLogin.bind(this);
    }

    onSignup() {
        hub.signup(this.state);
    }

	onLogin() {
        hub.login(this.state);
    }

    connectSocket() {

    }

    render() {
        return(
            <ScrollView style={styles.cellStyle}>
				<Text>SIGNUP</Text>
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
                <TouchableOpacity onPress={() => this.onSignup()}>
                    <Text>SEND</Text>
                </TouchableOpacity>

				<View style={styles.separator}></View>

				<Text>LOGIN</Text>
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
				<TouchableOpacity onPress={() => this.onLogin()}>
                    <Text>SEND</Text>
                </TouchableOpacity>
			</ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    cellStyle: {
        flex: 1,
		paddingTop: 70
	},
	separator: {
		height: 30
	},
    cellTextInputStyle: {
        height: 50,
		width: 300,
        paddingLeft: 15,
        marginBottom: 5,
        borderWidth: 0.7,
        borderRadius: 3,
        fontWeight: '200',
        fontSize: 15
    },
})

export default Auth;
