import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default class OnlineStatusComponent extends Component {

  constructor(props) {
    super(props)
    this.state = { visible: false }
    this.onlineStatusViewModel = this.props.onlineStatusViewModel
    this.unsubscribeFromViewModel = this
      .onlineStatusViewModel
      .visible
      .subscribe(visible => this.setState({ visible: visible}))
  }

  componentDidMount() {
    this.onlineStatusViewModel.onCreated()
  }

  componentWillUnmount() {
    this.onlineStatusViewModel.onDestroyed()
    this.unsubscribeFromViewModel()
  }

  render() {
    if (this.state.visible) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>No Internet connection</Text>
        </View>
      )
    }
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    height: 32
  },
  text: {
    fontSize: 16,
    textAlign: 'center'
  }
})
