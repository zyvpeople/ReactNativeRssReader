import React, {Component} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import NetworkService from '../domain/service/NetworkService'

export default class OnlineStatusComponent extends Component {

  constructor(props) {
    super(props)
    this.state = { isOnline: false }
    this.networkService = this.props.networkService
    this.unsubscribe = this
      .networkService
      .onlineStatusChanged
      .subscribe(this._onOnlineStatusChanged)
  }

  componentDidMount() {
    this._onOnlineStatusChanged()
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  _onOnlineStatusChanged = () => {
    this.setState({ isOnline: this.networkService.isOnline })
  }

  render() {
    if (this.state.isOnline) {
      return null
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>No Internet connection</Text>
        </View>
      )
    }
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
