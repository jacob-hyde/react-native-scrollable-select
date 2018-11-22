import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder
} from 'react-native';
import ScrollableSelect from './scrollableselect.js';

class scrollableselect extends Component{
  constructor(props){
    super(props);
    this.state = {
      values: [
        {label: 'Test 1', value: 1},
        {label: 'Test 2', value: 2}
      ],
      selected: 'Test 1'
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e) => {console.log('onStartShouldSetPanResponder'); return true;},
      onMoveShouldSetPanResponder: (e) => {console.log('onMoveShouldSetPanResponder'); return true;},
      onPanResponderGrant: (e) => console.log('onPanResponderGrant'),
      onPanResponderMove: (e) => console.log('onPanResponderMove'),
      onPanResponderRelease: (e) => console.log('onPanResponderRelease'),
      onPanResponderTerminate: (e) => console.log('onPanResponderTerminate')
    });
  }

  render(){
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to react-native-scrollable-select example!
        </Text>
        <ScrollableSelect
          values={this.state.values}
          onSelect={(selected, index) => {
            let label = this.state.values[index].label;
            this.setState({...this.state, selected: label});
          }}
          value={this.state.selected}
          placeholder={'Test Placeholder'}
        />
        <Text style={styles.instructions}>Value: {this.state.selected}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  }
});

AppRegistry.registerComponent('scrollableselect', () => scrollableselect);
