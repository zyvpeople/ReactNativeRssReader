import React, {Component} from 'react'
import {StyleSheet, View, WebView, Alert, ActivityIndicator } from 'react-native'

export default class BrowserComponent extends Component {

  static navigationOptions = { title: 'Browser' }

  constructor(props) {
    super(props)
    this.browserViewModel = this.props.browserViewModel
    this.state = {
      url: null,
      progress: false
    }
    this.unsubscribeFromUrl = this
      .browserViewModel
      .url
      .subscribe(url => this.setState({url:url}))
    this.unsubscribeFromProgress = this
      .browserViewModel
      .progress
      .subscribe(progress => this.setState({progress:progress}))
    this.unsubscribeFromLoadError = this
      .browserViewModel
      .loadError
      .subscribe(event => {
        Alert.alert(
          'Error',
          'Error load url',
          [{text:'Ok'}])
      })
  }

  componentDidMount() {
    this.browserViewModel.onCreated()
  }

  componentWillUnmount() {
    this.browserViewModel.onDestroyed()
    this.unsubscribeFromUrl()
    this.unsubscribeFromProgress()
    this.unsubscribeFromLoadError()
  }

  render() {
    const progress = this.state.progress
      ? (
        <View style={styles.loading}>
            <ActivityIndicator/>
        </View>
      )
      : null
    const url = this.state.url
    return (
      <View
        style={styles.container}>
        <WebView
          source={url === null ? null : {uri: url }}
          onLoadStart={() => this.browserViewModel.onLoadStart()}
          onLoad={() => this.browserViewModel.onLoad()}
          onError={() => this.browserViewModel.onError()}/>
        {progress}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.2,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
