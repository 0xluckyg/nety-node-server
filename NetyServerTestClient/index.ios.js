/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Logger from 'react-native-logger-client'
import App from './src/app'

import Auth from './src/auth';

export default class NetyServerTestClient extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <Auth/>
                </View>
                <View style={styles.logger}>
                    <Logger/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    logger: {
        paddingTop: 750,

        position: 'absolute',

        backgroundColor: 'red'
    }

});

AppRegistry.registerComponent('NetyServerTestClient', () => NetyServerTestClient);
