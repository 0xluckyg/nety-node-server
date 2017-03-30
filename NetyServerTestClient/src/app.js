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
import Main from './main';

class App extends Component {
    constructor(props) {
        super(props)

        this.renderLoginOrMain = this.renderLoginOrMain.bind(this);
    }

    renderLoginOrMain() {
        if (this.props.token === '') {
            return <Auth/>
        } else {
            return <Main/>
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.logger}>
                    <Logger/>
                </View>
                {this.renderLoginOrMain()}
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
        paddingTop: 150,

        position: 'absolute',

        backgroundColor: 'red'
    }

});

function mapStateToProps(state) {
    return {token:state.token}
}

export default connect(mapStateToProps)(App);
