import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Logger from 'react-native-logger-client'
import {connect} from 'react-redux';

import Auth from './auth';

class App extends Component {
    render(){
        return (
            <View style={styles.container}>
                {console.log('token: ' + this.props.token)}                
                <Auth/>
                <View style={styles.logger}>
                    <Logger/>
                </View>
            </View>
        )
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

function mapStateToProps(state) {
    return {token:state.token}
}

export default connect(mapStateToProps)(App);
