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
        this.createChatroomWithTest2 = this.createChatroomWithTest2.bind(this);
        this.createChatroomWithTest1 = this.createChatroomWithTest1.bind(this);
    }

    getNetwork() {
        hub.getNetwork();
    };

    createChatroomWithTest2() {
        hub.createChatroom('58e032963327b11aeb7eb2ea');
    };

    createChatroomWithTest1() {
        hub.createChatroom('58e0328a3327b11aeb7eb2e9');
    };



    render() {
        return(
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.getNetwork()}>
                    <Text>Get Network</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.createChatroomWithTest1()}>
                    <Text>Create Chatroom with Test 1</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.createChatroomWithTest2()}>
                    <Text>Create Chatroom with Test 2</Text>
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
