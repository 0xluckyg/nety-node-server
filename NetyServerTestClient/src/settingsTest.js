import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import hub from './hub';

class Settings extends Component {
    constructor(props) {
        super(props)

        this.logout = this.logout.bind(this);
    }

    logout() {
        hub.logout();
    }

    render() {
        return(
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.logout()}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 50,
        paddingTop: 70
    },
    logout: {

    }
})

export default Settings
