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

import Auth from './src/auth';

export default class NetyServerTestClient extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Auth/>
                <Logger/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});

AppRegistry.registerComponent('NetyServerTestClient', () => NetyServerTestClient);
