import React, {Component} from 'react'
import {StyleSheet, View, Text, Alert, Button} from 'react-native'

export default class FeedItemComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Feed item',
      headerRight: (
        <View
          style={styles.rightHeaderContainer}>
          <Button
            title='Browser'
            onPress={() => navigation.getParam('onOpenInBrowserPressed')()}/>
          <Button
            title='Share'
            onPress={() => navigation.getParam('onSharePressed')()}/>
        </View>
      )
    }
  }

  constructor(props) {
    super(props)
    this.feedItemViewModel = this.props.feedItemViewModel
    this.state = {
      feedItem: null
    }
    this.unsubscribeFromFeedItem = this
      .feedItemViewModel
      .feedItem
      .subscribe(feedItem => this.setState({ feedItem: feedItem }))
    this.unsubscribeFromLoadFeedItemError = this
      .feedItemViewModel
      .loadFeedItemError
      .subscribe(event =>
        Alert.alert(
          'Error',
          'Error load feed item',
          [{text:'Ok'}]))
          //TODO: handle click. make not dismissable
  }

  componentDidMount() {
    this.props.navigation.setParams({onOpenInBrowserPressed: this._onOpenInBrowserPressed})
    this.props.navigation.setParams({onSharePressed: this._onSharePressed})
    this.feedItemViewModel.onCreated()
  }

  componentWillUnmount() {
    this.feedItemViewModel.onDestroyed()
    this.unsubscribeFromFeedItem()
    this.unsubscribeFromLoadFeedItemError()
  }

  render() {
    if (this.state.feedItem === null) {
      return null
    }
    return (
      <View
        style={styles.container}>
        <Text>{this.state.feedItem.title}</Text>
      </View>
    )
  }

  _onOpenInBrowserPressed = () => this.feedItemViewModel.onOpenInBrowserPressed(this)

  _onSharePressed = () => this.feedItemViewModel.onSharePressed()
}

const styles = StyleSheet.create({
  rightHeaderContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  container: {
    flex: 1
  }
})
