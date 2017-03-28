/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';

import store from './src/redux/store';

import App from './src/app';

const NetyServerTestClient = () => {
    return(
        <Provider store={store}>
            <App/>
        </Provider>
    )
}

AppRegistry.registerComponent('NetyServerTestClient', () => NetyServerTestClient);
