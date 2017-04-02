import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import hub from './hub';

class Network extends Component {
    constructor(props) {
        super(props)

        this.getNetwork = this.getNetwork.bind(this);
    }

    getNetwork() {
        hub.getNetwork();
    };

    render() {
        return(
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.getNetwork()}>
                    <Text>Get Network</Text>
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

export default Network
