import React, {Component} from 'react'
import {StyleSheet, View, Text, Alert} from 'react-native'

export default class FeedItemComponent extends Component {

  static navigationOptions = { title: 'Feed item' }

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
