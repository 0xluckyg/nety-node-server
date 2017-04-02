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
import RandomString from 'random-string';

import hub from './hub';

class Auth extends Component {
    constructor(props){
        super(props);

        this.state = {
            age: '30',
            name: {
                first: RandomString({length: 5}),
                last: RandomString({length: 5})
            },
            email: RandomString({length: 5}) + '@gmail.com',
            password: RandomString({length: 8}),
        }

        this.onSignup = this.onSignup.bind(this);
		this.onLoginTest1 = this.onLoginTest1.bind(this);
		this.onLoginTest2 = this.onLoginTest2.bind(this);
		this.onFacebook = this.onFacebook.bind(this);
		this.onLinkedin = this.onLinkedin.bind(this);
    }

    onSignup() {
        hub.signup(this.state);
    }

	onLoginTest1() {
        hub.login({
			age: '30',
			email: "test1@gmail.com",
			password: "test1password"
		});
    }
	onLoginTest2() {
        hub.login({
			age: '30',
			email: "test2@gmail.com",
			password: "test2password"
		});
    }

    onFacebook() {

	}

	onLinkedin() {

	}

    render() {
        return(
            <ScrollView style={styles.cellStyle}>
				<View style={styles.container}>
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
                    value={'test1@gmail.com'}
                    onChangeText={(email) => this.setState({email})}
                    style={styles.cellTextInputStyle}
                    placeholder={'email'}>
				</TextInput>
                <TextInput
                    value={'test1password'}
                    onChangeText={(password) => this.setState({password})}
                    style={styles.cellTextInputStyle}
                    placeholder={'password'}>
				</TextInput>
				<TouchableOpacity onPress={() => this.onLoginTest1()}>
                    <Text>SEND</Text>
                </TouchableOpacity>
				<View style={styles.separator}></View>

				<Text>LOGIN</Text>
                <TextInput
                    value={'test2@naver.com'}
                    onChangeText={(email) => this.setState({email})}
                    style={styles.cellTextInputStyle}
                    placeholder={'email'}>
				</TextInput>
                <TextInput
                    value={'test2password'}
                    onChangeText={(password) => this.setState({password})}
                    style={styles.cellTextInputStyle}
                    placeholder={'password'}>
				</TextInput>
				<TouchableOpacity onPress={() => this.onLoginTest2()}>
                    <Text>SEND</Text>
                </TouchableOpacity>

				<View style={styles.separator}></View>

				<Text>FB AUTH</Text>
				<TouchableOpacity onPress={() => this.onFacebook()}>
					<Text>SEND</Text>
				</TouchableOpacity>

				<View style={styles.separator}></View>

				<Text>LINKEDIN AUTH</Text>
				<TouchableOpacity onPress={() => this.onLinkedin()}>
					<Text>SEND</Text>
				</TouchableOpacity>

				<View style={styles.separator}></View>
				<View style={styles.separator}></View>
				<View style={styles.separator}></View>
				</View>
			</ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    cellStyle: {
		paddingTop: 70,
	},
	container: {
		flex: 1,
		alignItems: 'center'
	},
	separator: {
		height: 30
	},
    cellTextInputStyle: {
		alignSelf: 'center',
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
