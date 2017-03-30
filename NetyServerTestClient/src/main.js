import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import TabNavigator from 'react-native-tab-navigator';

import Network from './networkTest';
import Settings from './settingsTest';

class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            selectedTab: 'network'
        }
    }

    render() {
        return(
            <TabNavigator
                tabBarStyle={{ height: 40, backgroundColor: 'black', overflow: 'hidden' }}
                sceneStyle={{ paddingBottom: 40 }}
            >
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'network'}
                    title="Network"
                    onPress={() => this.setState({ selectedTab: 'network' })}>
                    <Network/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'settings'}
                    title="Settings"
                    onPress={() => this.setState({ selectedTab: 'settings' })}>
                    <Settings/>
                </TabNavigator.Item>
            </TabNavigator>
        )
    }
}

export default Main
