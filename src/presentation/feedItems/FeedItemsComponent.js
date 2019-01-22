import React, {Component} from 'react'
import {StyleSheet, FlatList, View, Text, TouchableOpacity, Alert} from 'react-native'
import OnlineStatusComponent from '../onlineStatus/OnlineStatusComponent'

export default class FeedItemsComponent extends Component {

  static navigationOptions = { title: 'Feed items' }

  constructor(props) {
    super(props)
    this.feedItemsViewModel = this.props.feedItemsViewModel
    this.onlineStatusViewModel = this.props.onlineStatusViewModel
    this.state = {
      feedItems: [],
      refreshing: false
    }
    this.unsubscribeFromFeedItems = this
      .feedItemsViewModel
      .feedItems
      .subscribe(feedItems => this.setState({ feedItems: feedItems }))
    this.unsubscribeFromProgress = this
      .feedItemsViewModel
      .progress
      .subscribe(progress => this.setState({ refreshing: progress }))
    this.unsubscribeFromSyncError = this
      .feedItemsViewModel
      .syncError
      .subscribe(event =>
        Alert.alert(
          'Error',
          'Error sync feed',
          [{text:'Ok'}]))
  }

  componentDidMount() {
    this.feedItemsViewModel.onCreated()
  }

  componentWillUnmount() {
    this.feedItemsViewModel.onDestroyed()
    this.unsubscribeFromFeedItems()
    this.unsubscribeFromProgress()
    this.unsubscribeFromSyncError()
  }

  render() {
    return (
      <View
        style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.state.feedItems}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          refreshing={this.state.refreshing}
          onRefresh={() => this.feedItemsViewModel.onRefresh()}/>
      </View>
    )
  }

  _keyExtractor = (item, index) => `${item.id}`

  _renderItem = ({item}) =>
    <TouchableOpacity
      style={styles.item}
      onPress={() => this.feedItemsViewModel.onFeedItemPressed(this, item)}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    flex: 1
  },
  item: {
    height: 48
  }
})
